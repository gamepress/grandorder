import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import type { Servant } from "~/db/payload-custom-types";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const IllustratorsCommandCodes = ({ data }: any) => {
   const ccs = data?.illustrator?.cc_With_Illustrator;
   return (
      <>
         {ccs?.length > 0 ? (
            <>
               <H2>Command Codes with Illustrator</H2>
               <ListTable
                  gridView={gridView}
                  data={{ listData: { docs: ccs } }}
                  columns={columns}
                  pageSize={1000}
                  defaultSort={[{ id: "command_code_id", desc: false }]}
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
         to={`/c/command-codes/${
            info.row.original.slug ?? info.row.original.id
         }`}
      >
         <Image
            width={50}
            height={50}
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
   columnHelper.accessor("command_code_id", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Code",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/command-codes/${
                  info.row.original.slug ?? info.row.original.id
               }`}
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
   columnHelper.accessor("rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?.rarity?.id);
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
            parseFloat(A.original?.rarity?.name) -
            parseFloat(B.original?.rarity?.name)
         );
      },
   }),
];

const filters = [
   {
      id: "rarity",
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
