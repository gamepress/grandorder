import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const _SimulatorPools: CollectionConfig = {
   slug: "_simulator-pools",
   labels: { singular: "_Simulator-Pool", plural: "_Simulator-Pools" },
   admin: { group: "Custom", useAsTitle: "name" },

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
         name: "name",
         type: "text",
      },
      {
         name: "servants",
         type: "relationship",
         relationTo: "servants",
         hasMany: true,
      },
      {
         name: "craft_essences",
         type: "relationship",
         relationTo: "craft-essences",
         hasMany: true,
      },
      {
         name: "materials",
         type: "relationship",
         relationTo: "materials",
         hasMany: true,
      },
      {
         name: "command_codes",
         type: "relationship",
         relationTo: "command-codes",
         hasMany: true,
      },
      {
         name: "checksum",
         type: "text",
      },
   ],
};
