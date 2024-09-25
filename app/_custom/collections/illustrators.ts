import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const Illustrators: CollectionConfig = {
   slug: "illustrators",
   labels: { singular: "Illustrator", plural: "Illustrators" },
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
         name: "data_key",
         type: "text",
      },
      {
         name: "name",
         type: "text",
      },
      {
         name: "ce_With_Illustrator",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "cc_With_Illustrator",
         type: "relationship",
         relationTo: "command-codes",
         hasMany: true,
         admin: {
            readOnly: true,
         },
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
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
