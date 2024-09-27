import { Image } from "~/components/Image";
import { H2 } from "~/components/Headers";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const CraftEssenceEffectsCodes = ({ data }: any) => {
   const ccs = data?.effect?.cc_With_Effect?.map(
      // @ts-ignore
      (a) => {
         return { ...a, effect_id: data?.effect?.id };
      },
   );
   // Check if "Times", "Turns", or various sections need to appear (hide if all entries blank)
   const show_times = checkFieldHasEntry(data, "times");
   const show_turns = checkFieldHasEntry(data, "turns");
   const show_value = checkFieldHasEntry(data, "value");
   const show_cooldown = checkFieldHasEntry(data, "cooldown");

   return (
      <>
         {ccs?.length > 0 ? (
            <>
               <H2>Command Codes</H2>
               <ListTable
                  gridView={gridView}
                  data={{ listData: { docs: ccs } }}
                  columns={columns}
                  pageSize={1000}
                  defaultSort={[
                     { id: "value", desc: true },
                     { id: "command_code_id", desc: false },
                  ]}
                  columnViewability={{
                     command_code_id: false,
                     value: show_value,
                     turns: show_turns,
                     times: show_times,
                     cooldown: show_cooldown,
                  }}
                  filters={filters}
               />
            </>
         ) : null}
      </>
   );
};

const columnHelper = createColumnHelper<any>();

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
   columnHelper.accessor("value", {
      header: "Value",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1">
               <span>
                  {this_effect?.value}
                  {this_effect?.value_type == "percent" ? "%" : ""}
               </span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return (
            parseFloat(
               A?.original?.effect_list?.find(
                  (a) => a.effect?.id == A?.original?.effect_id,
               )?.value,
            ) -
            parseFloat(
               B?.original?.effect_list?.find(
                  (a) => a.effect?.id == B?.original?.effect_id,
               )?.value,
            )
         );
      },
   }),
   columnHelper.accessor("turns", {
      header: "Turns",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1">
               <span>{this_effect?.turns}</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return (
            parseFloat(
               A?.original?.effect_list?.find(
                  (a) => a.effect?.id == A?.original?.effect_id,
               )?.turns,
            ) -
            parseFloat(
               B?.original?.effect_list?.find(
                  (a) => a.effect?.id == B?.original?.effect_id,
               )?.turns,
            )
         );
      },
   }),
   columnHelper.accessor("times", {
      header: "Times",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1">
               <span>{this_effect?.times}</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return (
            parseFloat(
               A?.original?.effect_list?.find(
                  (a) => a.effect?.id == A?.original?.effect_id,
               )?.times,
            ) -
            parseFloat(
               B?.original?.effect_list?.find(
                  (a) => a.effect?.id == B?.original?.effect_id,
               )?.times,
            )
         );
      },
   }),
   columnHelper.accessor("cooldown", {
      header: "Cooldown",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1">
               <span>{this_effect?.cooldown}</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return (
            parseFloat(
               A?.original?.effect_list?.find(
                  (a) => a.effect?.id == A?.original?.effect_id,
               )?.cooldown,
            ) -
            parseFloat(
               B?.original?.effect_list?.find(
                  (a) => a.effect?.id == B?.original?.effect_id,
               )?.cooldown,
            )
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

function checkFieldHasEntry(data: any, fieldName: any) {
   const field_array = data?.effect?.cc_With_Effect
      .map(
         // @ts-ignore
         (a) => {
            const curr_effect = a.effect_list?.find(
               (b) => b.effect?.id == data?.effect?.id,
            );
            return curr_effect?.[fieldName];
         },
      )
      ?.filter((a) => a);

   return field_array?.length > 0;
}
