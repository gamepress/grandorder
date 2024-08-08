import type { Quest as QuestType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import { Fragment, useState } from "react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function Rewards({ data }: { data: any }) {
   const quest_drops = data.quest_drops;
   const quest_rewards = data.quest_rewards;
   return (
      <>
         {/* Drops */}
         <H2 text="Quest Drops" />
         <RewardsTable tabledata={quest_drops} />

         {/* Rewards */}
         <H2 text="Quest Rewards" />
         <RewardsTable tabledata={quest_rewards} />
      </>
   );
}

const RewardsTable = ({ tabledata }: any) => {
   return (
      <>
         <Table grid framed>
            <TableHead></TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {tabledata?.map((row, index) => (
                  <RewardRow data={row} index={index} key={index} />
               ))}
            </TableBody>
         </Table>
      </>
   );
};

const RewardRow = ({ data, index }: any) => {
   const tdformat = "py-2 px-3 leading-none border border-color-sub";

   const collection_type = data.mat?.relationTo;
   const icon = data.mat?.value?.icon?.url;
   const name = data.mat?.value?.name;
   const qty = data.qty;
   const rate = data.percentage;
   const max_drops = data.max_number_drops;
   const id = data.mat?.value?.id;
   const slug = data.mat?.value?.slug;
   const desc = data.other;

   return (
      <>
         <TableRow key={index + "rewdata"}>
            <td className={`text-left ${tdformat}`}>
               {name ? (
                  <>
                     <a href={`/c/${collection_type}/${slug ?? id}`}>
                        <div className="inline-block align-middle">
                           <Image
                              options="height=45&width=45"
                              className="object-contain inline-block"
                              url={icon}
                              alt="icon"
                              loading="lazy"
                           />
                        </div>
                        <div className="inline-block align-middle ml-2 text-base text-blue-500">
                           {name}
                        </div>
                     </a>
                     <div className="inline-block align-middle text-base ml-2">
                        x{qty}
                        {rate ? <span className="mx-2">{rate}%</span> : null}
                        {max_drops ? "(Max: " + max_drops + ")" : null}
                        <div
                           className="inline-block whitespace-pre-line mx-2"
                           dangerouslySetInnerHTML={{ __html: desc }}
                        ></div>
                     </div>
                  </>
               ) : (
                  <div
                     className="whitespace-pre-line mt-1"
                     dangerouslySetInnerHTML={{ __html: desc }}
                  ></div>
               )}
            </td>
         </TableRow>
      </>
   );
};
