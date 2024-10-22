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

export const CraftEssences: CollectionConfig = {
   slug: "craft-essences",
   labels: { singular: "Craft Essence", plural: "Craft Essences" },
   admin: { group: "Custom", useAsTitle: "name" },
   hooks: {
      afterChange: [afterChangeSearchSyncHook],
      afterDelete: [
         Delete_TermRelations(
            "cv", // Origin collection first level field name
            "cvs", // Target collection to update
            "ce_With_CV", // Target collection field to update
         ),
         Delete_TermRelations(
            "illustrator", // Origin collection first level field name
            "illustrators", // Target collection to update
            "ce_With_Illustrator", // Target collection field to update
         ),
         Delete_TermRelationsOneDeep(
            "effect_list", // Origin collection first level field name
            "effect", // Origin collection second level field name
            "_craft-essence-effects", // Target collection to update
            "ce_With_Effect", // Target collection field to update
         ),
         Delete_TermRelationsOneDeep(
            "effect_list", // Origin collection first level field name
            "bonus_item", // Origin collection second level field name
            "materials", // Target collection to update
            "ce_With_Drop_Bonus", // Target collection field to update
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
         name: "data_key",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "slug",
         type: "text",
      },
      {
         name: "library_number",
         type: "number",
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
         name: "_rarity",
         type: "relationship",
         relationTo: "_ce-rarities",
         hasMany: false,
      },
      {
         name: "_ce_Type_Image",
         type: "relationship",
         relationTo: "_ce-type-images",
         hasMany: false,
      },
      {
         name: "cost",
         type: "number",
      },
      {
         name: "base_atk",
         type: "number",
      },
      {
         name: "max_atk",
         type: "number",
      },
      {
         name: "base_hp",
         type: "number",
      },
      {
         name: "max_hp",
         type: "number",
      },
      {
         name: "description",
         type: "textarea",
      },
      {
         name: "description_limit_break",
         type: "textarea",
      },
      {
         name: "description_flavor",
         type: "textarea",
      },
      {
         name: "illustrator",
         type: "relationship",
         hooks: {
            afterChange: [
               Update_TermRelations(
                  "illustrator", // Origin collection first level field name
                  "illustrators", // Target collection to update
                  "ce_With_Illustrator", // Target collection field to update
               ),
            ],
         },
         relationTo: "illustrators",
         hasMany: false,
      },
      {
         name: "cv",
         type: "relationship",
         hooks: {
            afterChange: [
               Update_TermRelations(
                  "cv", // Origin collection first level field name
                  "cvs", // Target collection to update
                  "ce_With_CV", // Target collection field to update
               ),
            ],
         },
         relationTo: "cvs",
         hasMany: false,
      },
      {
         name: "release_date_jp",
         type: "text",
      },
      {
         name: "release_date_na",
         type: "text",
      },
      {
         name: "is_valentines",
         type: "checkbox",
      },
      {
         name: "is_bond_ce",
         type: "checkbox",
      },
      {
         name: "servant",
         type: "relationship",
         relationTo: "servants",
         hasMany: false,
      },
      {
         label: "effect_list",
         type: "collapsible",
         fields: [
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
                              "ce_With_Effect", // Target collection field to update
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
                     name: "value_mlb",
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
                     name: "activation_chance",
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
                     name: "condition_notes",
                     type: "text",
                  },
                  {
                     name: "bonus_item",
                     type: "relationship",
                     hooks: {
                        afterChange: [
                           Update_TermRelationsOneDeep(
                              "effect_list", // Origin collection first level field name
                              "bonus_item", // Origin collection second level field name
                              "materials", // Target collection to update
                              "ce_With_Drop_Bonus", // Target collection field to update
                           ),
                        ],
                     },
                     relationTo: "materials",
                     hasMany: true,
                  },
               ],
            },
         ],
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
