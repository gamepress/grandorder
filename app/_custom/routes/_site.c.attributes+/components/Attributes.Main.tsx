import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Servant } from "~/db/payload-custom-types";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const AttributesMain = ({ data }: any) => {
   const servants = data?.servants;
   return (
      <>
         <ListTable
            gridView={gridView}
            data={{ listData: { docs: servants } }}
            columns={columns}
            pageSize={1000}
            defaultSort={[
               { id: "release_status", desc: false },
               { id: "class", desc: false },
               { id: "library_id", desc: false },
            ]}
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
                  </div>
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("class", {
      header: "Class",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.class?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
               <Image
                  width={30}
                  height={30}
                  options="height=80&width=80"
                  url={info.row.original?.class?.icon?.url}
                  alt={"★"}
               />
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return A.original?.class?.id - B.original?.class?.id;
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
      sortingFn: (A, B, columnId) => {
         return A.original?.star_rarity?.id - B.original?.star_rarity?.id;
      },
   }),

   columnHelper.accessor("release_status", {
      header: "Server",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.release_status?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return A.original?.release_status?.id - B.original?.release_status?.id;
      },
   }),
];

const filters = [
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
];
