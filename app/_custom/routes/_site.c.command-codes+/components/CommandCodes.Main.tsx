import type { CommandCode as CommandCodeType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function CommandCodesMain({ data: cc }: { data: CommandCodeType }) {
   const mainStatDisplay = [
      {
         label: "ID",
         value: cc.command_code_id,
      },
      {
         label: "Rarity",
         value: cc.rarity?.name + "★",
      },
      {
         label: "Illustrator",
         value: cc.illustrator?.name,
      },
   ];

   return (
      <div className="tablet:flex max-tablet:flex-col items-start gap-3 pb-4">
         <div className="tablet:w-[340px]">
            <Image
               width={680}
               className="rounded-md max-laptop:w-full"
               url={cc?.image?.url}
               alt={cc?.name ?? ""}
            />
         </div>
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg flex-grow
         mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
         >
            {mainStatDisplay?.map((row) => (
               <div
                  key={row.value}
                  className="p-3 justify-between flex items-center gap-2"
               >
                  <div className="flex items-center gap-2">
                     <span className="font-semibold text-sm">{row.label}</span>
                  </div>
                  <div className="text-sm font-semibold">{row.value}</div>
               </div>
            ))}
         </div>
      </div>
   );
}
