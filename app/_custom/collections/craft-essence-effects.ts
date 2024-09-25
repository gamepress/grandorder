import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const CraftEssenceEffects: CollectionConfig = {
   slug: "craft-essence-effects",
   labels: {
      singular: "Craft-Essence-Effect",
      plural: "Craft-Essence-Effects",
   },
   admin: {
      group: "Custom",
      useAsTitle: "name",
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
         name: "drupal_tid",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "ce_With_Effect",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "cc_With_Effect",
         type: "relationship",
         relationTo: "command-codes",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
