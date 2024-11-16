import type { BeforeDuplicate } from "payload/types";

export const Duplicate_AppendIncrement: BeforeDuplicate<any> = ({ data }) => {
   var tempid = data?.id;
   var timestampid = new Date().getTime();
   const last_num = parseInt(tempid.replace(/.*-/, ""));
   if (tempid.indexOf("-") > -1 && last_num) {
      tempid = tempid.replace(/\-[^-]*$/, "") + "-" + timestampid;
   } else {
      tempid = tempid + "-" + timestampid;
   }
   // Clean ID if invalid URI characters exist
   tempid = tempid.replace(/[^a-zA-Z0-9-_]/g, "_");

   return {
      ...data,
      _id: tempid,
   };
};
