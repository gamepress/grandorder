import { H2, H3 } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function QuestsEnemies({ data }: { data: any }) {
   const quest_details = data.quest_details;

   return quest_details && quest_details?.length > 0
      ? quest_details?.map((qd: any, qind: any) => {
           const show_part =
              qind == 0
                 ? true
                 : quest_details[qind]?.quest_parts !=
                   quest_details[qind - 1]?.quest_parts
                 ? true
                 : false; // Controls whether the "Part" label should show up - Always show first

           return (
              <div key={qd}>
                 <QuestPartHeader data={qd} show_part={show_part} />
                 <Table grid framed dense>
                    <TableHead>
                       <TableRow>
                          <TableHeader>Enemies</TableHeader>
                          <TableHeader center>Class</TableHeader>
                          <TableHeader center>HP</TableHeader>
                          <TableHeader center>Lvl</TableHeader>
                       </TableRow>
                    </TableHead>
                    <TableBody>
                       {qd.enemy_details.map((qed: any, index: any) => {
                          return <QuestBattleWave data={qed} key={index} />;
                       })}
                    </TableBody>
                 </Table>
              </div>
           );
        })
      : "No enemies found...";
}

function QuestPartHeader({
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
            <H2>
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
            </H2>
         ) : null}
         <H3>{stage_display}</H3>
      </>
   );
}

function QuestBattleWave({ data }: { data: any }) {
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
            <TableCell>
               <div className="flex items-start gap-3">
                  <Image
                     height={60}
                     width={60}
                     className="size-7 flex-none"
                     url={enemy_icon}
                     alt="icon"
                     loading="lazy"
                  />
                  <div className="flex-grow">
                     <div className="text-base">{enemy_name}</div>
                     <div
                        className="text-xs whitespace-normal"
                        dangerouslySetInnerHTML={{ __html: enemy_desc }}
                     ></div>
                     {/* Alt Enemy */}
                     {enemy_alt?.length > 0 ? (
                        <>
                           <div className="w-full border-y border-color-sub py-0.5 mt-1.5 mb-2 text-sm font-bold">
                              Alternative Spawns
                           </div>
                           {enemy_alt.map((enemy: any) => (
                              <EnemyAlternative key={enemy} data={enemy} />
                           ))}
                        </>
                     ) : null}
                  </div>
               </div>
            </TableCell>
            {/* Class Icon */}
            <TableCell center>
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
            </TableCell>
            {/* HP */}
            <TableCell center>
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
            </TableCell>
            {/* Lvl */}
            <TableCell center>{lvl.toLocaleString()}</TableCell>
         </TableRow>
      </>
   );
}

function EnemyAlternative({ data }: { data: any }) {
   const class_icon = data?.enemy_class
      ? data.enemy_class?.icon?.url
      : data.enemy?.value?.class_rarity?.icon?.url;
   const enemy_icon = data.enemy?.value?.icon?.url;
   const enemy_name = data.enemy?.value?.name;
   const enemy_desc = data.details;
   const hp = data.hp;
   const lvl = data.level;

   return (
      <div className="flex items-start gap-3">
         <div className="flex flex-col gap-2">
            <Image
               width={48}
               height={48}
               className="size-6"
               url={enemy_icon}
               alt="icon"
               loading="lazy"
            />
            <Image
               width={48}
               height={48}
               className="size-6"
               url={class_icon}
               alt="icon"
               loading="lazy"
            />
         </div>
         <div className="">
            <div className="text-sm font-bold">{enemy_name}</div>
            <div className="text-sm text-1">
               Lvl: {lvl} HP: {hp}
            </div>
            <div
               className="text-xs"
               dangerouslySetInnerHTML={{ __html: enemy_desc }}
            ></div>
         </div>
      </div>
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