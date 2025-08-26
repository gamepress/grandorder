import type { CollectionConfig } from "payload/types";

import { isStaff } from "../../db/collections/users/users.access";

export const _ClassScoreNodes: CollectionConfig = {
   slug: "_class-score-nodes",
   labels: { singular: "_class-score-node", plural: "_class-score-nodes" },
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
         name: "name",
         type: "text",
      },
      {
         name: "icon",
         type: "upload",
         relationTo: "images",
      },
      {
         name: "class_score_board",
         type: "relationship",
         relationTo: "_class-score-boards",
         hasMany: false,
      },
      {
         name: "node",
         type: "number",
      },
      {
         name: "posx_left",
         type: "number",
      },
      {
         name: "posy_top",
         type: "number",
      },
      {
         name: "desc",
         type: "textarea",
      },
      {
         name: "effect_list",
         type: "array",
         fields: [
            {
               name: "effect",
               type: "relationship",
               relationTo: "servant-skill-effects",
               hasMany: false,
            },
            {
               name: "value_single",
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
         ],
      },
      {
         name: "unlock_materials",
         type: "array",
         fields: [
            {
               name: "qp_cost",
               type: "number",
            },
            {
               name: "materials",
               type: "array",
               fields: [
                  {
                     name: "material",
                     type: "relationship",
                     relationTo: "materials",
                     hasMany: false,
                  },
                  {
                     name: "qty",
                     type: "number",
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
