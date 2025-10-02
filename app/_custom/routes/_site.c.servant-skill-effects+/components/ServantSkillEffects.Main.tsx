import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const ServantSkillEffectsMain = ({ data }: any) => {
   const skill_list_base = extractSkillBaseData(data);
   const skill_list_upgrade = extractSkillUpgradeData(data);
   const np_list_base = extractNPBaseData(data);
   const np_list_upgrade = extractNPUpgradeData(data);

   const full_list = [
      ...skill_list_base,
      ...skill_list_upgrade,
      ...np_list_base,
      ...np_list_upgrade,
   ];

   // Check if "Times", "Turns", or various sections need to appear (hide if all entries blank)
   const show_times = checkFieldHasEntry(full_list, "effect_times");
   const show_turns = checkFieldHasEntry(full_list, "effect_turns");
   const show_value = checkFieldHasEntry(full_list, "value");
   const show_value_mlb = checkFieldHasEntry(full_list, "value_mlb");
   const show_condition = checkFieldHasEntry(full_list, "condition_notes");

   return (
      <>
         <ListTable
            gridView={gridView}
            data={{ listData: { docs: full_list } }}
            columns={columns}
            pageSize={1000}
            defaultSort={[
               { id: "effect_value_lv10", desc: true },
               { id: "id", desc: false },
            ]}
            columnViewability={{
               value: show_value,
               value_mlb: show_value_mlb,
               effect_turns: show_turns,
               effect_times: show_times,
               condition: show_condition,
               _rarity: false,
               class: false,
            }}
            filters={filters}
         />
      </>
   );
};

const columnHelper = createColumnHelper<Servant>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative w-full"
         to={`/c/craft-essences/${
            info.row.original.slug ?? info.row.original.id
         }`}
      >
         <div className="h-[50px] w-[50px] m-auto">
            <Image
               width={80}
               alt={"CE Icon"}
               url={info.row.original.icon?.url}
               className="object-contain rounded-t-md w-[50px]"
            />
         </div>
         <div
            className="truncate text-xs font-semibold text-center pt-1
               group-hover:underline decoration-zinc-400 underline-offset-2"
         >
            {info.getValue()}
         </div>
      </Link>
   ),
});

const columns = [
   columnHelper.accessor("name", {
      header: "Servant",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/servants/${
                  info.row.original.slug ?? info.row.original.id
               }`}
               className="flex items-center gap-3 group py-0.5"
            >
               <div className="flex-none h-[38px]">
                  <Image
                     width={80}
                     alt={"Servant Icon"}
                     url={info.row.original.icon?.url}
                     className="object-contain rounded-t-md w-[38px]"
                  />
               </div>
            </Link>
         );
      },
   }),
   columnHelper.accessor("skill_name", {
      header: "Skill/NP",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <>
               <div className="flex items-center">
                  <div className="flex-none h-[38px]">
                     <Image
                        width={80}
                        alt={"Skill Icon"}
                        url={info.row.original.skill_icon?.url}
                        className="object-contain w-[38px]"
                     />
                  </div>
                  <div className="truncate flex items-center gap-2 group-hover:underline text-xs p-1 whitespace-pre-wrap w-32">
                     <span className="font-bold">{info.getValue()}</span>
                  </div>
               </div>
            </>
         );
      },
   }),
   columnHelper.accessor("stype", {
      header: "Type",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.stype);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1 text-xs whitespace-pre-wrap w-12">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_value_lv1", {
      header: "Lv1",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.row.original.effect_value_lv1_display}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_value_lv10", {
      header: "MAX",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.row.original.effect_value_lv10_display}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_times", {
      header: "Times",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_turns", {
      header: "Turns",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_target", {
      header: "Target",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.effect_target);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1 text-xs whitespace-pre-wrap w-16">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("effect_condition", {
      header: "Condition",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1 text-xs whitespace-pre-wrap w-28">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),

   columnHelper.accessor("_rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?._rarity);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name} ★</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return (
            parseFloat(A.original?._rarity) - parseFloat(B.original?._rarity)
         );
      },
   }),
   columnHelper.accessor("class", {
      header: "Class",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.class);
      },
   }),
];

const filters = [
   {
      id: "_rarity",
      label: "Rarity",
      cols: 5 as const,
      options: [
         {
            value: "71",
            label: "1 ★",
         },
         {
            value: "66",
            label: "2 ★",
         },
         {
            value: "61",
            label: "3 ★",
         },
         {
            value: "56",
            label: "4 ★",
         },
         {
            value: "51",
            label: "5 ★",
         },
      ],
   },
   {
      id: "class",
      label: "Class",
      cols: 2 as const,
      options: [
         {
            value: "81",
            label: "Saber",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_1_GoldSaber.png",
         },
         {
            value: "86",
            label: "Archer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_2_Gold_Archer.png",
         },
         {
            value: "91",
            label: "Lancer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_3_Gold_Lancer.png",
         },
         {
            value: "96",
            label: "Rider",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_4_Gold_Rider.png",
         },
         {
            value: "101",
            label: "Caster",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_5_Gold_Caster.png",
         },
         {
            value: "106",
            label: "Assassin",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_6_Gold_Assassin.png",
         },
         {
            value: "111",
            label: "Berserker",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_7_Gold_Berserker.png",
         },
         {
            value: "76",
            label: "Shielder",

            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_8_Gold_Shielder.png",
         },
         {
            value: "116",
            label: "Ruler",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_9_Gold_Ruler.png",
         },
         {
            value: "126",
            label: "Avenger",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_11_Gold_Avenger.png",
         },
         {
            value: "2881",
            label: "Alter Ego",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_10_Gold_AlterEgo.png",
         },
         {
            value: "3171",
            label: "Moon Cancer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_23_MoonCancer.png",
         },
         {
            value: "3166",
            label: "Foreigner",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_25_Gold_Foreigner.png",
         },
         {
            value: "9566",
            label: "Pretender",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_28_Gold_Pretender.png",
         },
         {
            value: "10586",
            label: "Beast",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_33_Gold_Beast.png",
         },
      ],
   },
   {
      id: "effect_target",
      label: "Target",
      cols: 3 as const,
      options: [
         {
            value: "Self",
            label: "Self",
         },
         {
            value: "Ally",
            label: "Ally",
         },
         {
            value: "All Allies",
            label: "All Allies",
         },
         {
            value: "Enemy",
            label: "Enemy",
         },
         {
            value: "All Enemies",
            label: "All Enemies",
         },
         {
            value: "All Allies except Self",
            label: "All Allies except Self",
         },
         {
            value: "All Allies / All Enemies",
            label: "All Allies / All Enemies",
         },
         {
            value: "Field",
            label: "Field",
         },
         {
            value: "Ally (Additional)",
            label: "Ally (Additional)",
         },
      ],
   },
   {
      id: "stype",
      label: "Type",
      cols: 2 as const,
      options: [
         {
            value: "Skill Base",
            label: "Skill Base",
         },
         {
            value: "Skill Upgrade",
            label: "Skill Upgrade",
         },
         {
            value: "NP Base",
            label: "NP Base",
         },
         {
            value: "NP Upgrade",
            label: "NP Upgrade",
         },
      ],
   },
];

function checkFieldHasEntry(data: any, fieldName: any) {
   const field_array = data
      .map(
         // @ts-ignore
         (a) => a?.[fieldName],
      )
      ?.filter((a) => a);

   return field_array?.length > 0;
}

function extractSkillBaseData(data: any) {
   var skill_final: any = [];
   const entryid = data?.entry?.id;

   data?.servants_skill_base?.map((a) =>
      a.skills.map(
         (b) =>
            b.skill.effect_list?.map((eff) => {
               if (eff.effect.id == entryid) {
                  // Process data
                  var val10, val1, val10disp, val1disp;
                  if (eff.values_per_level?.length > 0) {
                     val1 = eff.values_per_level[0];
                     val10 = eff.values_per_level[9];
                  } else if (eff.value_single) {
                     val1 = eff.value_single;
                     val10 = eff.value_single;
                  }

                  if (eff.value_type == "percent") {
                     val1disp = val1 + "%";
                     val10disp = val10 + "%";
                  } else {
                     val1disp = val1;
                     val10disp = val10;
                  }

                  const condition_text = eff.effect_condition
                     .map((cond) => cond.value?.name)
                     ?.join(", ");

                  // Extract and generate data object for display
                  var temppush = {
                     id: a.id,
                     name: a.name,
                     slug: a.slug,
                     icon: { url: a.icon?.url },
                     _rarity: a.star_rarity?.id,
                     class: a.class?.id,

                     skill_id: b.skill.id,
                     skill_name: b.skill.name,
                     skill_icon: { url: b.skill._skill_Image?.icon?.url },
                     stype: "Skill Base",

                     effect_name: eff.effect.name,
                     effect_turns: eff.turns,
                     effect_times: eff.times,
                     effect_target: eff.target?.name,
                     effect_value_lv1: val1,
                     effect_value_lv10: val10,
                     effect_value_lv1_display: val1disp,
                     effect_value_lv10_display: val10disp,
                     effect_chance_per_level: eff.chance_per_level,
                     effect_condition: condition_text,
                  };

                  skill_final.push(temppush);
               }
            }),
      ),
   );

   return skill_final;
}

function extractSkillUpgradeData(data: any) {
   var skill_final: any = [];
   const entryid = data?.entry?.id;
   data?.servants_skill_upgrade?.map(
      (a) =>
         a.skills?.map(
            (b) =>
               b.upgrades?.map(
                  (upgrade) =>
                     upgrade.skill?.effect_list?.map((eff) => {
                        if (eff.effect.id == entryid) {
                           // Process data
                           var val10, val1, val10disp, val1disp;
                           if (eff.values_per_level?.length > 0) {
                              val1 = eff.values_per_level[0];
                              val10 = eff.values_per_level[9];
                           } else if (eff.value_single) {
                              val1 = eff.value_single;
                              val10 = eff.value_single;
                           }

                           if (eff.value_type == "percent") {
                              val1disp = val1 + "%";
                              val10disp = val10 + "%";
                           } else {
                              val1disp = val1;
                              val10disp = val10;
                           }

                           const condition_text = eff.effect_condition
                              .map((cond) => cond.value?.name)
                              ?.join(", ");

                           // Extract and generate data object for display
                           var temppush = {
                              id: a.id,
                              name: a.name,
                              slug: a.slug,
                              icon: { url: a.icon?.url },
                              _rarity: a.star_rarity?.id,
                              class: a.class?.id,

                              skill_id: upgrade.skill?.id,
                              skill_name: upgrade.skill?.name,
                              skill_icon: {
                                 url: upgrade.skill?._skill_Image?.icon?.url,
                              },
                              stype: "Skill Upgrade",

                              effect_name: eff.effect.name,
                              effect_turns: eff.turns,
                              effect_times: eff.times,
                              effect_target: eff.target?.name,
                              effect_value_lv1: val1,
                              effect_value_lv10: val10,
                              effect_value_lv1_display: val1disp,
                              effect_value_lv10_display: val10disp,
                              effect_chance_per_level: eff.chance_per_level,
                              effect_condition: condition_text,
                           };

                           skill_final.push(temppush);
                        }
                     }),
               ),
         ),
   );

   return skill_final;
}

function extractNPBaseData(data: any) {
   var np_final: any = [];
   const entryid = data?.entry?.id;
   data?.servants_np_base?.map(
      (a) =>
         a.noble_phantasm_base?.effect_list?.map((eff) => {
            if (eff.effect.id == entryid) {
               // Process data
               var val5, val1, val5disp, val1disp;
               if (eff.values_per_level?.length > 0) {
                  val1disp = eff.values_per_level[0];
                  val5disp = eff.values_per_level[4];
                  val1 = val1disp.replace(/\D/g, "");
                  val5 = val5disp.replace(/\D/g, "");
               }

               const condition_text = eff.effect_condition
                  .map((cond) => cond.value?.name)
                  ?.join(", ");

               // Extract and generate data object for display
               var temppush = {
                  id: a.id,
                  name: a.name,
                  slug: a.slug,
                  icon: { url: a.icon?.url },
                  _rarity: a.star_rarity?.id,
                  class: a.class?.id,

                  skill_id: a.noble_phantasm_base?.id,
                  skill_name: a.noble_phantasm_base?.name,
                  skill_icon: {
                     url: a.noble_phantasm_base?.card_type?.icon?.url,
                  },
                  stype: "NP Base",

                  effect_name: eff.effect.name,
                  effect_turns: eff.turns,
                  effect_times: eff.times,
                  effect_target: eff.target?.name,
                  effect_value_lv1: val1,
                  effect_value_lv10: val5,
                  effect_value_lv1_display: val1disp,
                  effect_value_lv10_display: val5disp,
                  effect_chance_per_level: eff.chance_per_level,
                  effect_condition: condition_text,
               };

               np_final.push(temppush);
            }
         }),
   );

   return np_final;
}

function extractNPUpgradeData(data: any) {
   var np_final: any = [];
   const entryid = data?.entry?.id;
   data?.servants_np_base?.map(
      (a) =>
         a.noble_phantasm_base?.np_upgrades?.map(
            (b) =>
               b.effect_list?.map((eff) => {
                  if (eff.effect.id == entryid) {
                     // Process data
                     var val5, val1, val5disp, val1disp;
                     if (eff.values_per_level?.length > 0) {
                        val1disp = eff.values_per_level[0];
                        val5disp = eff.values_per_level[4];
                        val1 = val1disp.replace(/\D/g, "");
                        val5 = val5disp.replace(/\D/g, "");
                     }

                     const condition_text = eff.effect_condition
                        .map((cond) => cond.value?.name)
                        ?.join(", ");

                     // Extract and generate data object for display
                     var temppush = {
                        id: a.id,
                        name: a.name,
                        slug: a.slug,
                        icon: { url: a.icon?.url },
                        _rarity: a.star_rarity?.id,
                        class: a.class?.id,

                        skill_id: b.id,
                        skill_name: b.name,
                        skill_icon: {
                           url: b.card_type?.icon?.url,
                        },
                        stype: "NP Upgrade",

                        effect_name: eff.effect.name,
                        effect_turns: eff.turns,
                        effect_times: eff.times,
                        effect_target: eff.target?.name,
                        effect_value_lv1: val1,
                        effect_value_lv10: val5,
                        effect_value_lv1_display: val1disp,
                        effect_value_lv10_display: val5disp,
                        effect_chance_per_level: eff.chance_per_level,
                        effect_condition: condition_text,
                     };

                     np_final.push(temppush);
                  }
               }),
         ),
   );

   return np_final;
}
