import type { CollectionConfig } from "payload/types";

import { Delete_TermRelations } from "./hooks/Delete_TermRelations";
import { Delete_TermRelationsOneDeep } from "./hooks/Delete_TermRelationsOneDeep";
import { Update_TermRelations } from "./hooks/Update_TermRelations";
import { Update_TermRelationsOneDeep } from "./hooks/Update_TermRelationsOneDeep";
import { isStaff } from "../../db/collections/users/users.access";
import {
   afterChangeSearchSyncHook,
   afterDeleteSearchSyncHook,
} from "../hooks/search-hooks";

export const CommandCodes: CollectionConfig = {
   slug: "command-codes",
   labels: { singular: "Command-Code", plural: "Command-Codes" },
   admin: { group: "Custom", useAsTitle: "name" },
   hooks: {
      afterChange: [afterChangeSearchSyncHook],
      afterDelete: [
         Delete_TermRelations(
            "illustrator", // Origin collection first level field name
            "illustrators", // Target collection to update
            "cc_With_Illustrator", // Target collection field to update
         ),
         Delete_TermRelationsOneDeep(
            "effect_list", // Origin collection first level field name
            "effect", // Origin collection second level field name
            "craft-essence-effects", // Target collection to update
            "cc_With_Effect", // Target collection field to update
         ),
         afterDeleteSearchSyncHook,
      ],
   },

   access: {
      create: isStaff, //udpate in future to allow site admins as well
      read: () => true,
      update: isStaff, //udpate in future to allow site admins as well
      delete: isStaff, //udpate in future to allow site admins as well
   },
   fields: [
      {
         name: "id",
         type: "text",
      },
      {
         name: "drupal_nid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "command_code_id",
         type: "number",
      },
      {
         name: "acquisition_method",
         type: "textarea",
      },
      {
         name: "desc_effect",
         type: "textarea",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "image",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "effect_image",
         type: "relationship",
         relationTo: "_ce-type-images",
         hasMany: false,
      },
      {
         name: "rarity",
         type: "relationship",
         relationTo: "_ce-rarities",
         hasMany: false,
      },
      {
         name: "effect_list",
         type: "array",
         fields: [
            {
               name: "effect",
               type: "relationship",
               hooks: {
                  afterChange: [
                     Update_TermRelationsOneDeep(
                        "effect_list", // Origin collection first level field name
                        "effect", // Origin collection second level field name
                        "craft-essence-effects", // Target collection to update
                        "cc_With_Effect", // Target collection field to update
                     ),
                  ],
               },
               relationTo: "craft-essence-effects",
               hasMany: false,
            },
            {
               name: "value",
               type: "number",
            },
            {
               name: "turns",
               type: "number",
            },
            {
               name: "times",
               type: "number",
            },
            {
               name: "cooldown",
               type: "number",
            },
            {
               name: "value_type",
               type: "select",
               hasMany: false,
               options: [
                  {
                     label: "flat",
                     value: "flat",
                  },
                  {
                     label: "percent",
                     value: "percent",
                  },
               ],
            },
            {
               name: "effect_condition",
               type: "relationship",
               relationTo: [
                  "_alignments",
                  "attributes",
                  "_buff-categories",
                  "_classes",
                  "_command-cards",
                  "craft-essence-effects",
                  "_enemy-traits",
                  "_field-types",
                  "_status-effects",
                  "_targets",
                  "traits",
               ],
               hasMany: true,
            },
            {
               name: "condition_notes",
               type: "text",
            },
         ],
      },
      {
         name: "illustrator",
         type: "relationship",
         hooks: {
            afterChange: [
               Update_TermRelations(
                  "illustrator", // Origin collection first level field name
                  "illustrators", // Target collection to update
                  "cc_With_Illustrator", // Target collection field to update
               ),
            ],
         },
         relationTo: "illustrators",
         hasMany: false,
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
