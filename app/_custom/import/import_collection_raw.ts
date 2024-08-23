// General Importer that accepts arguments!

// usage: in package.json, add the following script:
// "import_collection_data": "cross-env PAYLOAD_CONFIG_PATH=./app/db/payload.custom.config.ts ts-node -T app/_custom/import/import_collection_data.ts"

// In the command line of the root directory, the following command can be run:
// pnpm import_collection_data collection,filename,idname,sync,overwrite
// ------------- Examples -------------
// collection:COLLECTIONSLUG  [Required]
// filename:FILE.json  [Required]
// idname:IDFIELDNAME  [Required]
// sync:false // TRUE = Import synchronously, one at a time. FALSE = Async.
// overwrite:false // TRUE = Force overwrite, even with matching checksum. FALSE = ignores matching checksum imports.
// -------------- PNPM Sample ----------------
// pnpm import_collection_data collection:materials,filename:Material.json,idname:data_key,sync:false,overwrite:false
// -------------- Notes ---------------
// - sync option needs to be used if field hooks used in a collection require the hooks to be executed in series, since otherwise they are by default executed simultaneously (example: A collection has a hook that updates another collection such that it has a list of all entries related to that collection, such as a list of all characters that use an item)
// - Generally overwrite does not need to be defined, but can be set to true for testing purposes.

// ==================
// Notes about the format of FILE.json
// ==================
// - Check the import_files/readme.md file for some formatting rules on relationship fields, etc.!
// - FILE.json MUST contain the following fields:
//   - ID (defined in idname argument)
//   - name
// - All other field names should match the collection definition field names.

const args = process.argv.slice(2)?.[0]?.split(",");

// Parse Arguments
const collection = args
   ?.find((a) => a.split(":")?.[0] == "collection")
   ?.split(":")?.[1];
const filename = args
   ?.find((a) => a.split(":")?.[0] == "filename")
   ?.split(":")?.[1];
const idname = args
   ?.find((a) => a.split(":")?.[0] == "idname")
   ?.split(":")?.[1];
const sync =
   args?.find((a) => a.split(":")?.[0] == "sync")?.split(":")?.[1] === "true";
const overwrite =
   args?.find((a) => a.split(":")?.[0] == "overwrite")?.split(":")?.[1] ===
   "true";

if (!collection || !filename || !idname) {
   console.log(
      "The raw collection importer will attempt an import from the source JSON into the target collection without any further modification of the JSON. However, it requires an ID in the JSON argument, and should match an existing entry in the database if an update is desired.\n\nArguments for collection:COLLECTIONSLUG, filename:FILE.json, idname:IDFIELDNAME are required!\nPlease enter arguments after pnpm import_collection_data.\n\nUse format:\npnpm import_collection_data collection:materials,filename:Material.json,idname:data_key,sync:false,overwrite:false",
   );
   process.exit(-1);
}

import Payload from "payload";
// import { Materials } from "../collections/materials";

//const CollectionData = require("../collections/" + collection + ".ts");
//const Materials = CollectionData[Object.keys(CollectionData)[0]];

require("dotenv").config();

const { PAYLOADCMS_SECRET, CUSTOM_DB_URI } = process.env;

//Array of objects matching the payload shape, change to match your need
const collectionName = collection;
const data = require("./import_files/" + filename);
const idField = idname;
// const siteId = "lKJ16E5IhH";
const userId = "644068fa51c100f909f89e1e"; // NorseFTX@gamepress.gg User ID for author field
const importsync = sync ?? false;

const forceOverwrite = overwrite ?? false; // Force overwrite even if checksum is matching.

let payload = null as any;

//const fieldConfig = Materials.fields;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      //@ts-ignore
      mongoURL: CUSTOM_DB_URI as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         if (importsync) {
            getDataSync().then(
               (result) => {
                  process.exit(0);
               },
               (err) => {
                  console.error(err);
                  process.exit(-1);
               },
            );
         } else {
            getData().then(
               (result) => {
                  process.exit(0);
               },
               (err) => {
                  console.error(err);
                  process.exit(-1);
               },
            );
         }
      },
   });
start();

async function getDataSync() {
   let results = [];
   for (let item of data) {
      let r = await seedUploads(item).then((myResult) => 1);
      results.push(r);
   }
   return results;
}

const getData = async () =>
   Promise.all(data.map((item: any) => seedUploads(item))); //Change this another function based on what you are uploading

//Uploads an entry and custom field data; NOTE: Still need to add "check for existing entry" functionality
const seedUploads = async (result: any) => {
   // For now exclude best_drop_locations field
   // delete result["best_drop_locations"];

   if (!result[idField]) {
      console.log(
         "ERROR: Field idname not found. Make sure the idname argument in pnpm import_collection_data is correct!",
      );
   }
   const idValue = result[idField].toString();

   // Check if entry exists
   const existingEntry = await payload.find({
      collection: collectionName,
      where: {
         [idField]: {
            equals: idValue,
         },
      },
   });

   // Update entry if exists
   if (existingEntry.docs.length > 0) {
      if (
         result.checksum == existingEntry.docs[0].checksum &&
         !forceOverwrite
      ) {
         console.log(`Entry "${idValue}" checksum match, SKIPPING.`);
      } else {
         console.log(
            `Entry "${idField}: ${idValue}" already exists. Overwriting data.`,
         );

         const custID = existingEntry.docs[0].id;

         var custData = {
            ...result,
            //name: result?.name.toString(),
         };

         const updateItemCustom = await payload.update({
            collection: collectionName,
            id: custID,
            data: custData,
         });
         console.log(`${idValue} Custom Entry updated!`);
      }
   }

   // Otherwise, create a new entry
   else {
      var custData = {
         ...result,
         id: result?.[idField],
         //name: result?.name.toString(),
      };

      const createItemCustom = await payload.create({
         collection: collectionName,
         data: custData,
      });

      console.log(`${idField}: ${idValue} Custom Data Import completed!`);
   }
};

//Sleep function to limit speed, can remove if not needed
const sleep = (milliseconds: any) => {
   const start = new Date().getTime();
   for (let i = 0; i < 1e7; i += 1) {
      if (new Date().getTime() - start > milliseconds) {
         break;
      }
   }
};
