import Payload from "payload";

import type { Servant } from "~/db/payload-custom-types";

import { deserializeSlate } from "./deserializeSlate";

require("dotenv").config();

const { PAYLOADCMS_SECRET } = process.env;

const { JSDOM } = require("jsdom");

let payload = null as any;

//Start payload instance
const start = async () =>
   await Payload.init({
      secret: PAYLOADCMS_SECRET as any,
      local: true,
      onInit: (_payload) => {
         payload = _payload;
         payload.logger.info(`Payload initialized...`);
         mapper();
      },
   });
start();

async function mapper() {
   const results = await fetch(
      `http://localhost:4000/api/servants?limit=500&depth=0&sort=name`,
   ).then((response) => response.json());

   try {
      await Promise.all(
         results.docs.map(async (row: Servant) => {
            try {
               console.log(row.name);
               const cleanedWriteupOverview = row?.writeup_overview
                  ? row?.writeup_overview
                       .replace(/[\n\r]/g, "")
                       .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                  : undefined;

               const writeup_overview = deserializeSlate(
                  new JSDOM(cleanedWriteupOverview).window.document.body,
               );

               const existingAnalysOverviewEmbed = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: { equals: "J959gyNV53" },
                     relationId: { equals: row.id },
                     collectionEntity: { equals: "J959gyNV53servants" },
                     subSectionId: { equals: "overview" }, //Overview subsection Id
                  },
               });

               if (
                  cleanedWriteupOverview &&
                  existingAnalysOverviewEmbed.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "overview",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_overview],
                        _status: "published",
                     },
                  });
               }

               //Gameplay Tips

               const cleanedGamePlayWriteupOverview = row?.writeup_gameplay_tips
                  ? row?.writeup_gameplay_tips
                       .replace(/[\n\r]/g, "")
                       .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                  : undefined;

               const writeup_gameplay_tips = deserializeSlate(
                  new JSDOM(cleanedGamePlayWriteupOverview).window.document
                     .body,
               );

               const existingWriteup_gameplay_tipsEmbed = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: { equals: "J959gyNV53" },
                     relationId: { equals: row.id },
                     collectionEntity: { equals: "J959gyNV53servants" },
                     subSectionId: { equals: "gameplay-tips" }, //Overview subsection Id
                  },
               });

               if (
                  cleanedGamePlayWriteupOverview &&
                  existingWriteup_gameplay_tipsEmbed.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "gameplay-tips",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_gameplay_tips],
                        _status: "published",
                     },
                  });
               }

               //Strengths
               const cleanedwriteup_strengths = row?.writeup_strengths
                  ? row?.writeup_strengths
                       .replace(/[\n\r]/g, "")
                       .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                  : undefined;

               const writeup_strengths = deserializeSlate(
                  new JSDOM(cleanedwriteup_strengths).window.document.body,
               );

               const existingwriteup_strengths = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: { equals: "J959gyNV53" },
                     relationId: { equals: row.id },
                     collectionEntity: { equals: "J959gyNV53servants" },
                     subSectionId: { equals: "strengths" }, //Overview subsection Id
                  },
               });

               if (
                  cleanedwriteup_strengths &&
                  existingwriteup_strengths.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "strengths",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_strengths],
                        _status: "published",
                     },
                  });
               }

               //Weaknesses
               const cleanedwriteup_weaknesses = row?.writeup_weaknesses
                  ? row?.writeup_weaknesses
                       .replace(/[\n\r]/g, "")
                       .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                  : undefined;

               const writeup_weaknesses = deserializeSlate(
                  new JSDOM(cleanedwriteup_weaknesses).window.document.body,
               );

               const existingwriteup_weaknesses = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: { equals: "J959gyNV53" },
                     relationId: { equals: row.id },
                     collectionEntity: { equals: "J959gyNV53servants" },
                     subSectionId: { equals: "weaknesses" }, //Overview subsection Id
                  },
               });

               if (
                  cleanedwriteup_weaknesses &&
                  existingwriteup_weaknesses.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "weaknesses",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_weaknesses],
                        _status: "published",
                     },
                  });
               }

               //Writeup_skill_level_explanation
               const cleanedwriteup_skill_level_explanation =
                  row?.writeup_skill_level_explanation
                     ? row?.writeup_skill_level_explanation
                          .replace(/[\n\r\t]/g, "")
                          .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                     : undefined;

               const writeup_skill_level_explanation = deserializeSlate(
                  new JSDOM(cleanedwriteup_skill_level_explanation).window
                     .document.body,
               );

               const existingwriteup_skill_level_explanation =
                  await payload.find({
                     collection: "contentEmbeds",
                     where: {
                        site: { equals: "J959gyNV53" },
                        relationId: { equals: row.id },
                        collectionEntity: { equals: "J959gyNV53servants" },
                        subSectionId: {
                           equals: "level-up-skill-recommendations",
                        }, //Overview subsection Id
                     },
                  });

               if (
                  cleanedwriteup_skill_level_explanation &&
                  existingwriteup_skill_level_explanation.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "level-up-skill-recommendations",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_skill_level_explanation],
                        _status: "published",
                     },
                  });
               }

               //Writeup_recommended_ces
               const cleanwriteup_recommended_ces = row?.writeup_recommended_ces
                  ? row?.writeup_recommended_ces
                       .replace(/[\n\r\t]/g, "")
                       .replace(/<p>\s*&nbsp;\s*<\/p>/g, "")
                  : undefined;

               const writeup_recommended_ces = deserializeSlate(
                  new JSDOM(cleanwriteup_recommended_ces).window.document.body,
               );

               const existingwriteup_recommended_ces = await payload.find({
                  collection: "contentEmbeds",
                  where: {
                     site: { equals: "J959gyNV53" },
                     relationId: { equals: row.id },
                     collectionEntity: { equals: "J959gyNV53servants" },
                     subSectionId: { equals: "craft-essence-recommendations" }, //Overview subsection Id
                  },
               });

               if (
                  cleanwriteup_recommended_ces &&
                  existingwriteup_recommended_ces.docs.length == 0
               ) {
                  // deserializeSlate() accepts HTML and converts it

                  await payload.create({
                     collection: "contentEmbeds",
                     data: {
                        subSectionId: "craft-essence-recommendations",
                        relationId: row?.id,
                        site: "J959gyNV53",
                        collectionEntity: "J959gyNV53servants",
                        author: "64db2a95cc762c815ac64cd3",
                        content: [...writeup_recommended_ces],
                        _status: "published",
                     },
                  });
               }

               console.log(`Document added successfully`);
            } catch (e) {
               payload.logger.error(`Document failed to update`);

               payload.logger.error(e);
            }
         }),
      );
   } catch (e) {
      payload.logger.error("Something went wrong.");
      payload.logger.error(e);
   }

   console.log("Complete");
   process.exit(0);
}
