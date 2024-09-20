import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import type { Servant } from "~/db/payload-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";

export { listMeta as meta };

export async function loader({
   request,
   params,
   context: { payload, user },
}: LoaderFunctionArgs) {
   const list = await fetchList({
      payload,
      user,
      params,
      request,
      gql: {
         query: QUERY,
      },
   });

   return json({ list });
}

export default function Servants() {
   return (
      <List
         gridView={gridView}
         columns={columns}
         columnViewability={{
            type: false,
            class: false,
            release_status: false,
         }}
         filters={filters}
      />
   );
}

const columnHelper = createColumnHelper<Servant>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/pokemon/${info.row.original.slug}`}
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
];
