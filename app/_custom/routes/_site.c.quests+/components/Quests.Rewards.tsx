import { Link } from "@remix-run/react";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";

export function QuestsRewards({ data }: { data: any }) {
   const quest_rewards = data.quest_rewards;
   return (
      <>
         {/* Rewards */}
         {quest_rewards && quest_rewards.length > 0 ? (
            <div className="border border-color-sub rounded-lg divide-color-sub divide-y bg-2-sub shadow-sm shadow-1">
               {quest_rewards?.map((row: any, index: number) => (
                  <RewardRow data={row} index={index} key={index} />
               ))}
            </div>
         ) : (
            "No quest rewards"
         )}
      </>
   );
}

export function QuestsDrops({ data }: { data: any }) {
   const quest_drops = data?.quest_drops;
   return (
      <>
         {/* Drops */}
         {quest_drops && quest_drops.length > 0 ? (
            <div className="border border-color-sub rounded-lg divide-color-sub divide-y bg-2-sub shadow-sm shadow-1">
               {quest_drops?.map((row: any, index: number) => (
                  <RewardRow data={row} index={index} key={index} />
               ))}
            </div>
         ) : (
            "No quest drops"
         )}
      </>
   );
}

const RewardRow = ({ data, index }: any) => {
   const collection_type = data.mat?.relationTo?.replace("_", "-");
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
         <Link
            className="block p-3 group"
            to={`/c/${collection_type}/${slug ?? id}`}
         >
            {name ? (
               <>
                  <div className="flex items-center gap-3">
                     <Image
                        width={80}
                        className="w-10 flex-none"
                        url={icon}
                        alt="icon"
                        loading="lazy"
                     />
                     <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                           <div
                              className="text-base font-bold underline underline-offset-2 dark:group-hover:decoration-zinc-500 
                              group-hover:decoration-zinc-400 decoration-zinc-200 dark:decoration-zinc-600"
                           >
                              {name}
                           </div>
                           <Badge className="!text-sm">x{qty}</Badge>
                           {rate ? (
                              <Badge>
                                 <span>{rate}%</span>
                                 {max_drops ? "(Max: " + max_drops + ")" : null}
                              </Badge>
                           ) : null}
                        </div>
                        <div
                           className="whitespace-pre-line text-sm"
                           dangerouslySetInnerHTML={{ __html: desc }}
                        ></div>
                     </div>
                  </div>
               </>
            ) : (
               <div
                  className="whitespace-pre-line mt-1"
                  dangerouslySetInnerHTML={{ __html: desc }}
               ></div>
            )}
         </Link>
      </>
   );
};
