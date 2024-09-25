import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Servant } from "~/db/payload-custom-types";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const IllustratorsCraftEssences = ({ data }: any) => {
   const ces = data?.illustrator?.ce_With_Illustrator;
   return (
      <>
         {ces?.length > 0 ? (
            <>
               <H2>Craft Essences with Illustrator</H2>
               <ListTable
                  gridView={gridView}
                  data={{ listData: { docs: ces } }}
                  columns={columns}
                  pageSize={1000}
                  defaultSort={[{ id: "library_number", desc: false }]}
                  filters={filters}
                  defaultViewType={"grid"}
               />
            </>
         ) : null}
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
            {info.row.original._rarity?.icon_frame?.url ? (
               <Image
                  options="height=52&width=50"
                  alt={"Frame"}
                  url={info.row.original._rarity?.icon_frame?.url}
                  className="object-contain z-10 absolute"
               />
            ) : null}
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
   columnHelper.accessor("library_number", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Essence",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/craft-essences/${
                  info.row.original.slug ?? info.row.original.id
               }`}
               className="flex items-center gap-3 group py-0.5"
            >
               <div className="flex-none h-[38px]">
                  {info.row.original._rarity?.icon_frame?.url ? (
                     <Image
                        options="height=40&width=38"
                        alt={"Frame"}
                        url={info.row.original._rarity?.icon_frame?.url}
                        className="object-contain z-10 absolute"
                     />
                  ) : null}
                  <Image
                     width={80}
                     alt={"CE Icon"}
                     url={info.row.original.icon?.url}
                     className="object-contain rounded-t-md w-[38px]"
                  />
               </div>
               <span className="decoration-zinc-400 underline-offset-2 truncate">
                  <div className="truncate flex items-center gap-2 group-hover:underline text-sm pb-1">
                     <span className="font-bold">{info.getValue()}</span>
                  </div>
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("_rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?._rarity?.id);
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
            parseFloat(A.original?._rarity?.name) -
            parseFloat(B.original?._rarity?.name)
         );
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
];
