import type { BeforeDuplicate } from "payload/types";

export const Duplicate_AppendIncrement: BeforeDuplicate<any> = ({ data }) => {
   var tempid = data?.id;
   const last_num = parseInt(tempid.replace(/.*-/, ""));
   if (tempid.indexOf("-") > -1 && last_num) {
      // If making clone of a clone, to avoid requerying the entire collection, will add timestamp as ID. Only the first clone will have -1.
      var timestampid = new Date().getTime();
      tempid = tempid.replace(/\-[^-]*$/, "") + "-" + timestampid;
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
