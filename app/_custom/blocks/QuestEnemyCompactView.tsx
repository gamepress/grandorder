import type { ReactNode } from "react";
import { gql, request as gqlRequest } from "graphql-request";
import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";

import useSWR from "swr";

import type { ListElement } from "~/routes/_editor+/core/types";
import { Loading } from "~/components/Loading";

type Props = {
   refId: String;
};

export const QuestEnemyCompactView = ({ refId }: Props) => {
   const questid = refId;
   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Quest(id: "${questid}") {
               id
               name
               ap_cost
               slug
               quest_details {
                  quest_parts
                  battle_stage
                  enemy_details {
                     enemy {
                        relationTo
                        value {
                           ... on Enemy {
                              id
                              name
                              slug
                              icon {
                                 url
                              }
                              class_rarity {
                                 icon {
                                    url
                                 }
                              }
                           }
                           ... on Servant {
                              id
                              name
                              slug
                              icon {
                                 url
                              }
                           }
                        }
                     }
                     hp
                     enemy_class {
                        name
                        icon {
                           url
                        }
                     }
                     break_bars {
                        icon {
                           url
                        }
                     }
                  }
               }
               quest_drops {
                  mat {
                     relationTo
                     value {
                        ... on Material {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on Servant {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on CraftEssence {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on CommandCode {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                     }
                  }
                  qty
                  percentage
                  max_number_drops
                  other
               }
               quest_rewards {
                  mat {
                     relationTo
                     value {
                        ... on Material {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on Servant {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on CraftEssence {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                        ... on CommandCode {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                     }
                  }
                  qty
                  other
               }
            }
         }
      `,
      (query: any) => gqlRequest("http://localhost:4000/api/graphql", query),
   );
   if (error) return null;
   if (isLoading) return <Loading />;

   //@ts-ignore
   const quest = data?.Quest;

   // Table formatting section
   const table_format = "w-full";
   const th_format =
      "bg-blue-500 bg-opacity-10 text-blue-900 dark:text-blue-100 font-bold text-xs px-1 border border-color-sub";

   const td_format = "px-1 border border-color-sub text-xs text-center";

   const styling = `<style>
   .material-embedded-qty {
   text-shadow: 1px 1px 1px #000,-1px -1px 1px #000,-1px 1px 1px #000,1px -1px 1px #000;
   color: #fff;
   position: absolute;
   }
   </style>`;

   return (
      <div contentEditable={false} className="">
         <div dangerouslySetInnerHTML={{ __html: styling }}></div>

         <a href={`/c/quests/${quest.id}`}>
            <div className="flex border border-color-sub shadow-1 shadow-color px-3 py-1 my-1 rounded-md bg-2-sub justify-between font-bold items-center">
               <div className="text-blue-400">{quest.name}</div>
               <div>{quest.ap_cost} AP</div>
            </div>
         </a>

         <div className="my-1">
            <table className={table_format}>
               <thead>
                  <tr>
                     <th className={th_format}>Battle</th>
                     <th className={th_format}>Wave</th>
                     <th className={`w-2/3 ${th_format}`}>Enemy Name</th>
                     <th className={th_format}>Class</th>
                     <th className={th_format}>HP</th>
                  </tr>
               </thead>

               <tbody>
                  {/* Enemy Waves */}
                  {quest.quest_details?.map((qd, qind) => {
                     const wavespan = qd?.enemy_details?.length ?? 0;

                     // Count the number of enemies in this given part, set rowspan
                     const partspan =
                        qind == 0 ||
                        quest.quest_details[qind - 1]?.quest_parts !=
                           qd.quest_parts
                           ? quest.quest_details
                                ?.filter((a) => a.quest_parts == qd.quest_parts)
                                ?.map((a) => a.enemy_details)
                                ?.flat()?.length
                           : 0;

                     // Count the number of enemies in this wave, set rowspan
                     const wave_display =
                        qd?.battle_stage?.slice(-3)?.[1] == "_"
                           ? qd?.battle_stage?.slice(-3)?.replace("_", "/")
                           : "1/1";

                     const first_enemy = qd?.enemy_details[0];
                     const remaining_enemies = qd?.enemy_details?.filter(
                        (a, i) => i > 0,
                     );

                     return (
                        <>
                           <tr>
                              {partspan > 0 ? (
                                 <td rowSpan={partspan} className={td_format}>
                                    Part {qd.quest_parts}
                                 </td>
                              ) : null}
                              <td rowSpan={wavespan} className={td_format}>
                                 {wave_display}
                              </td>
                              <EnemyRowDisplay enemy={first_enemy} />
                           </tr>
                           {remaining_enemies?.map((e) => {
                              return (
                                 <tr>
                                    <EnemyRowDisplay enemy={e} />
                                 </tr>
                              );
                           })}
                        </>
                     );
                  })}

                  {/* Drops */}
                  <tr>
                     <th className={th_format}>Drops</th>
                     <td className={`text-left ${td_format}`} colSpan={4}>
                        <div className="flex">
                           {quest.quest_drops?.map((drop, dind) => (
                              <RewardRow data={drop} index={dind} />
                           ))}
                        </div>
                     </td>
                  </tr>

                  {/* Rewards */}
                  <tr>
                     <th className={th_format}>Rewards</th>
                     <td className={`text-left ${td_format}`} colSpan={4}>
                        <div className="flex">
                           {quest.quest_rewards?.map((drop, dind) => (
                              <RewardRow data={drop} index={dind} />
                           ))}
                        </div>
                     </td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>
   );
};

const RewardRow = ({ data, index }: any) => {
   const collection_type = data.mat?.relationTo;
   const icon = data.mat?.value?.icon?.url;
   const name = data.mat?.value?.name;
   const qty = data.qty;
   const rate = data.percentage;
   const id = data.mat?.value?.id;
   const slug = data.mat?.value?.slug;
   const desc = data.other;

   var dispqty = qty;

   if (qty > 1000000) {
      dispqty = Math.round(qty / 100000) / 10 + "M";
   } else if (qty > 1000) {
      dispqty = Math.round(qty / 1000) + "k";
   }

   return (
      <>
         <Link className="p-1" to={`/c/${collection_type}/${slug ?? id}`}>
            <div className="text-center relative overflow-clip">
               <div className="relative">
                  <Image
                     height={80}
                     className="h-10"
                     url={icon}
                     alt="icon"
                     loading="lazy"
                  />
                  {qty > 1 ? (
                     <div className="material-embedded-qty text-right bottom-0 right-[3px] text-[10pt]">
                        {dispqty}
                     </div>
                  ) : null}

                  <div
                     className="material-embedded-qty text-left top-0 left-0 text-nowrap text-[9pt]"
                     dangerouslySetInnerHTML={{ __html: desc }}
                  ></div>
               </div>
               {rate ? <div className="text-[7pt]">{rate}%</div> : null}
            </div>
         </Link>
      </>
   );
};

const EnemyRowDisplay = ({ enemy }: any) => {
   const class_icon = enemy.enemy_class
      ? enemy.enemy_class?.icon?.url
      : enemy.enemy?.value?.class_rarity?.icon?.url;
   const enemy_icon = enemy.enemy?.value?.icon?.url;
   const enemy_name = enemy.enemy?.value?.name;
   const enemy_id = enemy?.enemy?.value?.slug ?? enemy?.enemy?.value?.id;
   const enemy_relation = enemy?.enemy?.relationTo;
   const hp = enemy.hp;
   const break_bars = enemy.break_bars;

   const td_format = "p-1 border text-xs border-color-sub";

   return (
      <>
         <td className={td_format}>
            <div className="flex items-center gap-3">
               <a href={`/c/${enemy_relation}/${enemy_id}`}>
                  <Image
                     height={"auto"}
                     width={25}
                     className="w-[25px] flex-none "
                     url={enemy_icon}
                     alt="icon"
                     loading="lazy"
                  />
               </a>
               <div className="flex-grow">
                  <a href={`/c/${enemy_relation}/${enemy_id}`}>
                     <div className="text-xs text-blue-500">{enemy_name}</div>
                  </a>
               </div>
            </div>
         </td>
         <td className={td_format}>
            {class_icon ? (
               <Image
                  width={48}
                  height={48}
                  className="size-6 mx-auto"
                  url={class_icon}
                  alt="icon"
                  loading="lazy"
               />
            ) : null}
         </td>
         <td className={`text-center ${td_format}`}>
            {hp.toLocaleString()}
            {/* Break Bars */}
            {break_bars?.length > 0 ? (
               <div>
                  {/* @ts-ignore */}
                  {break_bars.map((bar, index) => (
                     <div key={index} className="inline-block">
                        <Image
                           options="height=22&width=22"
                           className="object-contain inline-block"
                           url={bar.icon?.url}
                           alt="icon"
                           loading="lazy"
                        />
                     </div>
                  ))}
               </div>
            ) : null}
         </td>
      </>
   );
};
