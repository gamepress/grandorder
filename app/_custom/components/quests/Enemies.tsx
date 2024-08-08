import type { Quest as QuestType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

const thformat =
   "p-2 leading-none text-left border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none border border-color-sub";

export function Enemies({ data }: { data: any }) {
   return (
      <>
         <Enemy_Details data={data} />
      </>
   );
}

function Enemy_Details({ data: quest }: any) {
   const quest_details = quest.quest_details;
   return (
      <>
         <H2 text="Enemy Details" />
         {quest_details?.map((qd: any, qind: any) => {
            const show_part =
               qind == 0
                  ? true
                  : quest_details[qind]?.quest_parts !=
                    quest_details[qind - 1]?.quest_parts
                  ? true
                  : false; // Controls whether the "Part" label should show up - Always show first

            return (
               <>
                  <Quest_Part_Header data={qd} show_part={show_part} />

                  <Table grid framed>
                     <TableHead>
                        <TableRow>
                           <TableHeader center className="w-full">
                              <span className="font-bold text-base cursor-default">
                                 Enemies
                              </span>
                           </TableHeader>
                           <TableHeader center>
                              <span className="font-bold text-base cursor-default">
                                 Class
                              </span>
                           </TableHeader>
                           <TableHeader center>
                              <span className="font-bold text-base cursor-default">
                                 HP
                              </span>
                           </TableHeader>
                           <TableHeader center>
                              <span className="font-bold text-base cursor-default">
                                 Lvl
                              </span>
                           </TableHeader>
                        </TableRow>
                     </TableHead>
                     <TableBody>
                        {qd.enemy_details.map((qed: any, index: any) => {
                           return <Quest_Battle_Wave data={qed} key={index} />;
                        })}
                     </TableBody>
                  </Table>
               </>
            );
         })}
      </>
   );
}

function Quest_Part_Header({
   data,
   show_part,
}: {
   data: any;
   show_part: boolean;
}) {
   const stage_key = data.battle_stage;
   const stage_display = battle_stage.find((a) => a.value == stage_key)?.label;
   const part_display = "Part " + data.quest_parts;
   const guest = data.guest_servants;
   return (
      <>
         {show_part ? (
            <>
               <div className="border-t border-b border-color-sub text-lg font-bold py-1 mb-3 mt-6">
                  {part_display}

                  {guest?.length > 0 ? (
                     <>
                        {guest.map((g: any, gi: any) => (
                           <div className="text-xs font-normal" key={gi}>
                              Guest Servant:{" "}
                              <a
                                 className="text-blue-500"
                                 href={`/c/servants/${g.id}`}
                              >
                                 {g.name}
                              </a>
                           </div>
                        ))}
                     </>
                  ) : null}
               </div>
            </>
         ) : null}
         <div className="text-sm mt-3">{stage_display}</div>
      </>
   );
}

function Quest_Battle_Wave({ data }: { data: any }) {
   const class_icon = data?.enemy_class
      ? data.enemy_class?.icon?.url
      : data.enemy?.value?.class_rarity?.icon?.url;
   const enemy_icon = data.enemy?.value?.icon?.url;
   const enemy_name = data.enemy?.value?.name;
   const enemy_desc = data.details;
   const hp = data.hp;
   const lvl = data.level;
   const break_bars = data.break_bars;

   const enemy_alt = data.enemy_alternative;
   return (
      <>
         <TableRow>
            {/* Enemy */}
            <td className={`text-left ${tdformat}`}>
               <div className="inline-block align-top mr-2">
                  <Image
                     options="height=30&width=30"
                     className="object-contain inline-block"
                     url={enemy_icon}
                     alt="icon"
                     loading="lazy"
                  />
               </div>
               <div className="inline-block align-top pt-1 w-11/12">
                  <div className="text-base">{enemy_name}</div>
                  <div
                     className="text-xs whitespace-normal"
                     dangerouslySetInnerHTML={{ __html: enemy_desc }}
                  ></div>
                  {/* Alt Enemy */}
                  {enemy_alt?.length > 0 ? (
                     <>
                        <div className="w-full border-b border-t my-1 text-sm font-bold">
                           Alternative Spawns
                        </div>
                        {enemy_alt.map((enemy: any) => (
                           <Enemy_Alternative data={enemy} />
                        ))}
                     </>
                  ) : null}
               </div>
            </td>
            {/* Class Icon */}
            <td className={`text-center ${tdformat}`}>
               {class_icon ? (
                  <Image
                     options="height=24&width=24"
                     className="object-contain inline-block"
                     url={class_icon}
                     alt="icon"
                     loading="lazy"
                  />
               ) : null}
            </td>
            {/* HP */}
            <td className={`text-center ${tdformat}`}>
               {hp.toLocaleString()}
               {/* Break Bars */}
               {break_bars?.length > 0 ? (
                  <div>
                     {break_bars.map((bar, index) => (
                        <div className="inline-block">
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
            {/* Lvl */}
            <td className={`text-center ${tdformat}`}>
               {lvl.toLocaleString()}
            </td>
         </TableRow>
      </>
   );
}

function Enemy_Alternative({ data }: { data: any }) {
   const class_icon = data?.enemy_class
      ? data.enemy_class?.icon?.url
      : data.enemy?.value?.class_rarity?.icon?.url;
   const enemy_icon = data.enemy?.value?.icon?.url;
   const enemy_name = data.enemy?.value?.name;
   const enemy_desc = data.details;
   const hp = data.hp;
   const lvl = data.level;

   return (
      <>
         <div className="inline-block align-top mr-1">
            <Image
               options="height=22&width=22"
               className="object-contain inline-block"
               url={class_icon}
               alt="icon"
               loading="lazy"
            />
         </div>
         <div className="inline-block align-top mr-2">
            <Image
               options="height=22&width=22"
               className="object-contain inline-block"
               url={enemy_icon}
               alt="icon"
               loading="lazy"
            />
         </div>
         <div className="inline-block align-top pt-1">
            <div className="text-sm">{enemy_name}</div>
            <div className="text-sm">
               Lvl: {lvl} HP: {hp}
            </div>
            <div
               className="text-xs"
               dangerouslySetInnerHTML={{ __html: enemy_desc }}
            ></div>
         </div>
      </>
   );
}

const battle_stage = [
   { value: "battle1_1", label: "Battle 1/1" },
   { value: "battle1_2", label: "Battle 1/2" },
   { value: "battle2_2", label: "Battle 2/2" },
   { value: "battle1_3", label: "Battle 1/3" },
   { value: "battle2_3", label: "Battle 2/3" },
   { value: "battle3_3", label: "Battle 3/3" },
   { value: "battle1_4", label: "Battle 1/4" },
   { value: "battle2_4", label: "Battle 2/4" },
   { value: "battle3_4", label: "Battle 3/4" },
   { value: "battle4_4", label: "Battle 4/4" },
   { value: "battle1_5", label: "Battle 1/5" },
   { value: "battle2_5", label: "Battle 2/5" },
   { value: "battle3_5", label: "Battle 3/5" },
   { value: "battle4_5", label: "Battle 4/5" },
   { value: "battle5_5", label: "Battle 5/5" },
   { value: "battle1_6", label: "Battle 1/6" },
   { value: "battle2_6", label: "Battle 2/6" },
   { value: "battle3_6", label: "Battle 3/6" },
   { value: "battle4_6", label: "Battle 4/6" },
   { value: "battle5_6", label: "Battle 5/6" },
   { value: "battle6_6", label: "Battle 6/6" },
   { value: "fatal_battle1_1", label: "Fatal Battle 1/1" },
   { value: "fatal_battle1_2", label: "Fatal Battle 1/2" },
   { value: "fatal_battle2_2", label: "Fatal Battle 2/2" },
   { value: "fatal_battle1_3", label: "Fatal Battle 1/3" },
   { value: "fatal_battle2_3", label: "Fatal Battle 2/3" },
   { value: "fatal_battle3_3", label: "Fatal Battle 3/3" },
   { value: "fatal_battle1_4", label: "Fatal Battle 1/4" },
   { value: "fatal_battle2_4", label: "Fatal Battle 2/4" },
   { value: "fatal_battle3_4", label: "Fatal Battle 3/4" },
   { value: "fatal_battle4_4", label: "Fatal Battle 4/4" },
   { value: "fatal_battle5_5", label: "Fatal Battle 5/5" },
   { value: "fatal_battle6_6", label: "Fatal Battle 6/6" },
   { value: "fatal_battle1_7", label: "Fatal Battle 1/7" },
   { value: "fatal_battle2_7", label: "Fatal Battle 2/7" },
   { value: "fatal_battle3_7", label: "Fatal Battle 3/7" },
   { value: "fatal_battle4_7", label: "Fatal Battle 4/7" },
   { value: "fatal_battle5_7", label: "Fatal Battle 5/7" },
   { value: "fatal_battle6_7", label: "Fatal Battle 6/7" },
   { value: "fatal_battle7_7", label: "Fatal Battle 7/7" },
   { value: "grand_battle1_1", label: "Grand Battle 1/1" },
   { value: "sword_death1_1", label: "Sword, or Death 1/1" },
   { value: "advent_beast", label: "ADVENT BEAST" },
   { value: "slay_beast", label: "SLAY BEAST" },
   { value: "childhoods_end", label: "Childhood's End" },
   {
      value: "tree_has_awakened",
      label: "Tree Has Awakened 1/1",
   },
   { value: "starry_heavens1_1", label: "Starry Heavens 1/1" },
   {
      value: "evil_humanity_fetus1_1",
      label: "Evil of Humanity (Fetus) 1/1",
   },
];
