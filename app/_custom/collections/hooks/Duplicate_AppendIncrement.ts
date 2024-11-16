import type { BeforeDuplicate } from "payload/types";

export const Duplicate_AppendIncrement: BeforeDuplicate<any> = ({ data }) => {
   var tempid = data?.id;
   const last_num = parseInt(tempid.replace(/.*-/, ""));
   if (tempid.indexOf("-") > -1 && last_num) {
      tempid = tempid.replace(/\-[^-]*$/, "") + "-" + (last_num + 1);
   } else {
      tempid = tempid + "-1";
   }
   // Clean ID if invalid URI characters exist
   tempid = tempid.replace(/[^a-zA-Z0-9-_]/g, "_");

   return {
      ...data,
      _id: tempid,
   };
};
