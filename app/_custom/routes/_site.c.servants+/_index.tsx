import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";
import { z } from "zod";
import { zx } from "zodix";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import type { Servant } from "payload/generated-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";
import { useState, useEffect } from "react";
import { useLoaderData } from "@remix-run/react";

export { listMeta as meta };

export async function loader({
   request,
   params,
   context: { payload, user },
}: LoaderFunctionArgs) {
   const { viewtab, filterstate } = zx.parseQuery(request, {
      viewtab: z.string().optional(),
      filterstate: z.string().optional(),
   });
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY,
      },
   });

   return json({
      list,
      viewtab: viewtab,
      filterstate: filterstate,
   });
}

const colViewSettings = [
   {
      name: "default",
      label: "Default",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         release_status: false,
         star_rarity: true,
         tier_list_score: true,
         hp_base: false,
         atk_base: false,
         hp_max: false,
         atk_max: false,
         star_generation_rate: false,
         star_absorption: false,
         instant_death_chance: false,
         np_charge_per_hit: false,
         np_charge_when_attacked: false,
         summon_availability: false,
         alignment: false,
      },
   },
   {
      name: "stats",
      label: "HP/ATK",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         release_status: false,
         star_rarity: false,
         tier_list_score: false,
         hp_base: true,
         atk_base: true,
         hp_max: true,
         atk_max: true,
         star_generation_rate: false,
         star_absorption: false,
         instant_death_chance: false,
         np_charge_per_hit: false,
         np_charge_when_attacked: false,
         summon_availability: false,
         alignment: false,
      },
   },
   {
      name: "addstats",
      label: "Other",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         release_status: false,
         star_rarity: false,
         tier_list_score: false,
         hp_base: false,
         atk_base: false,
         hp_max: false,
         atk_max: false,
         star_generation_rate: true,
         star_absorption: true,
         instant_death_chance: true,
         np_charge_per_hit: true,
         np_charge_when_attacked: true,
         summon_availability: false,
         alignment: false,
      },
   },
   {
      name: "availability",
      label: "Availability",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         release_status: false,
         star_rarity: true,
         tier_list_score: false,
         hp_base: false,
         atk_base: false,
         hp_max: false,
         atk_max: false,
         star_generation_rate: false,
         star_absorption: false,
         instant_death_chance: false,
         np_charge_per_hit: false,
         np_charge_when_attacked: false,
         summon_availability: true,
         alignment: false,
      },
   },
   {
      name: "alignment",
      label: "Alignment",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         release_status: false,
         star_rarity: true,
         tier_list_score: false,
         hp_base: false,
         atk_base: false,
         hp_max: false,
         atk_max: false,
         star_generation_rate: false,
         star_absorption: false,
         instant_death_chance: false,
         np_charge_per_hit: false,
         np_charge_when_attacked: false,
         summon_availability: false,
         alignment: true,
      },
   },
];

export default function Servants() {
   // @ts-ignore
   const { viewtab, filterstate } = useLoaderData();

   const urlFilters = filterstate
      ? JSON.parse(decodeURIComponent(filterstate))
      : [];

   // If the viewtab setting is legal, use it, otherwise default
   const [colView, setColView] = useState(
      colViewSettings.find((a) => a.name == viewtab) ? viewtab : "default",
   );

   const currCols =
      colViewSettings.find((a) => a.name == colView)?.setting ?? {};

   console.log(columns);

   return (
      <>
         {urlFilters?.length > 0 ? (
            <List
               gridView={gridView}
               columns={columns}
               columnViewability={currCols}
               filters={filters}
               defaultFilters={urlFilters}
               beforeListComponent={
                  <ColumnSelector
                     colView={colView}
                     setColView={setColView}
                     colViewSettings={colViewSettings}
                  />
               }
            />
         ) : (
            <List
               gridView={gridView}
               columns={columns}
               columnViewability={currCols}
               filters={filters}
               //defaultFilters={urlFilters}
               beforeListComponent={
                  <ColumnSelector
                     colView={colView}
                     setColView={setColView}
                     colViewSettings={colViewSettings}
                  />
               }
            />
         )}
      </>
   );
}

const ColumnSelector = ({ colView, setColView, colViewSettings }: any) => {
   return (
      <div className="mx-auto max-w-[728px] max-tablet:px-3 ">
         <h2 className="px-4 h-8 flex items-center mb-2 w-full">
            Show Columns
         </h2>
         <div className="grid grid-cols-3 gap-2">
            {colViewSettings.map((set: any, index: any) => {
               return (
                  <div
                     className={`flex bg-3 h-9 text-sm cursor-pointer justify-center items-center dark:border-zinc-600 shadow-sm dark:shadow-zinc-800/80 rounded-md border border-zinc-300/80  ${
                        set.name == colView
                           ? "bg-blue-50 dark:bg-gray-800 text-blue-500 dark:text-blue-500"
                           : "text-zinc-500"
                     }`}
                     onClick={() => setColView(set.name)}
                     key={"col_select_" + index}
                  >
                     {set.label}
                  </div>
               );
            })}
         </div>
      </div>
   );
};

const columnHelper = createColumnHelper<Servant>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/servants/${info.row.original.slug}`}
      >
         <Image
            width={36}
            height={36}
            url={info.row.original.icon?.url}
            className="mx-auto"
            options="aspect_ratio=1:1&height=80&width=80"
         />
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
   columnHelper.accessor("library_id", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Servant",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/servants/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               <Image
                  width={38}
                  url={info.row.original.icon?.url}
                  options="width=80"
               />
               <span className="decoration-zinc-400 underline-offset-2 truncate">
                  <div className="truncate flex items-center gap-2 group-hover:underline text-sm pb-1">
                     <span className="font-bold">{info.getValue()}</span>
                     <span className="text-xs text-1">
                        {info.row.original.class?.name}
                     </span>
                  </div>
                  <div
                     className="flex items-center gap-0.5 text-[10px]"
                     dangerouslySetInnerHTML={{
                        __html:
                           info.row.original?.deck_layout?.description ?? "",
                     }}
                  />
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("icon", {
      header: "Servant",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/servants/${info.row.original.slug}`}
               className="flex items-center gap-3 group py-0.5"
            >
               <Image
                  width={38}
                  url={info.row.original.icon?.url}
                  options="width=80"
               />
            </Link>
         );
      },
   }),
   columnHelper.accessor("star_rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.star_rarity?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
               <Image
                  width={13}
                  height={13}
                  options="height=80&width=80"
                  url={info.row.original?.star_rarity?.icon?.url}
                  alt={"★"}
               />
            </div>
         );
      },
   }),
   columnHelper.accessor("class", {
      header: "Class",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.class?.id);
      },
   }),
   columnHelper.accessor("release_status", {
      header: "Server",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.release_status?.id);
      },
   }),
   columnHelper.accessor("tier_list_score", {
      header: "Tier",
      filterFn: fuzzyFilter,
      cell: (info) => {
         switch (info.getValue()) {
            case 101:
               return <Badge color="violet">EX+</Badge>;

            case 100:
               return <Badge color="violet">EX</Badge>;

            case 99:
               return <Badge color="violet">EX-</Badge>;

            case 91:
               return <Badge color="blue">A+</Badge>;

            case 90:
               return <Badge color="blue">A</Badge>;

            case 81:
               return <Badge color="green">B+</Badge>;

            case 80:
               return <Badge color="green">B</Badge>;

            case 71:
               return <Badge color="yellow">C+</Badge>;

            case 70:
               return <Badge color="yellow">C</Badge>;

            case 61:
               return <Badge color="zinc">D+</Badge>;

            case 60:
               return <Badge color="zinc">D</Badge>;

            case 50:
               return <Badge color="zinc">E</Badge>;
            default:
         }
         return "-";
      },
   }),
   // Stats
   columnHelper.accessor("hp_base", {
      header: "HP Base",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("atk_base", {
      header: "ATK Base",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("hp_max", {
      header: "HP Max",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("atk_max", {
      header: "ATK Max",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("star_generation_rate", {
      header: "Star Gen",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("star_absorption", {
      header: "Star Abs",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("instant_death_chance", {
      header: "Death Rate",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("np_charge_per_hit", {
      header: "NP% Hit",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("np_charge_when_attacked", {
      header: "NP% Attacked",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("summon_availability", {
      header: "Availability",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.summon_availability?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("alignment", {
      header: "Alignment",
      filterFn: (row, columnId, filterValue) => {
         return filterValue
            ?.map((a) =>
               row?.original?.alignment?.name?.toLowerCase()?.includes(a),
            )
            ?.every((v) => v === true);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
            </div>
         );
      },
   }),
];

// Add stats under atk_lv120 later.
const QUERY = gql`
   query {
      listData: Servants(
         limit: 2000
         sort: "library_id"
         where: {
            library_id: { not_equals: null }
            name: { not_equals: "Mash (Ortinax)" }
         }
      ) {
         docs {
            id
            name
            library_id
            cost
            hp_base
            hp_max
            atk_base
            atk_max
            star_generation_rate
            star_absorption
            instant_death_chance
            np_charge_per_hit
            np_charge_when_attacked
            class {
               id
               name
               icon {
                  url
               }
            }
            release_status {
               id
               name
            }
            attribute {
               id
               name
            }
            deck_layout {
               name
               description
            }
            alignment {
               id
               name
            }
            icon {
               url
            }
            star_rarity {
               id
               name
               icon {
                  url
               }
            }
            summon_availability {
               id
               name
               description
            }
            jp_release_date
            np_release_date
            slug
            tier_list_score
         }
      }
   }
`;

const filters = [
   {
      id: "star_rarity",
      label: "Rarity",
      cols: 5 as const,
      options: [
         {
            value: "3046",
            label: "0 ★",
         },
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
      id: "release_status",
      label: "Server",
      cols: 2 as const,
      options: [
         {
            value: "1691",
            label: "NA",
         },
         {
            value: "1696",
            label: "JP",
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
      id: "summon_availability",
      label: "Availability",
      cols: 2 as const,
      options: [
         {
            value: "4041",
            label: "Non-Limited",
         },
         {
            value: "4076",
            label: "Limited",
         },

         {
            value: "4486",
            label: "Story-locked",
         },
         {
            value: "5071",
            label: "Friend Point Summon",
         },
         {
            value: "4121",
            label: "Welfare",
         },
         {
            value: "4116",
            label: "Starting Servant",
         },
         {
            value: "4126",
            label: "Unavailable",
         },
      ],
   },
   {
      id: "alignment",
      label: "Alignment",
      cols: 2 as const,
      options: [
         {
            value: "lawful",
            label: "Lawful",
         },
         {
            value: "good",
            label: "Good",
         },
         {
            value: "neutral",
            label: "Neutral",
         },
         {
            value: "balanced",
            label: "Balanced",
         },
         {
            value: "chaotic",
            label: "Chaotic",
         },
         {
            value: "evil",
            label: "Evil",
         },
         {
            value: "summer",
            label: "Summer",
         },
         {
            value: "bride",
            label: "Bride",
         },
         {
            value: "madness",
            label: "Madness",
         },
      ],
   },
];
