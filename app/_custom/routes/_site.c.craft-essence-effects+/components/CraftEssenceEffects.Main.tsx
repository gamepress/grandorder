import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";

export const CraftEssenceEffectsMain = ({ data }: any) => {
   const ces = data?.effect?.ce_With_Effect.map(
      // @ts-ignore
      (a) => {
         return { ...a, effect_id: data?.effect?.id };
      },
   );
   // Check if "Times", "Turns", or various sections need to appear (hide if all entries blank)
   const show_times = checkFieldHasEntry(data, "times");
   const show_turns = checkFieldHasEntry(data, "turns");
   const show_value = checkFieldHasEntry(data, "value");
   const show_value_mlb = checkFieldHasEntry(data, "value_mlb");
   const show_condition = checkFieldHasEntry(data, "condition_notes");

   return (
      <>
         <ListTable
            gridView={gridView}
            data={{ listData: { docs: ces } }}
            columns={columns}
            pageSize={1000}
            defaultSort={[
               { id: "value_mlb", desc: true },
               { id: "library_number", desc: false },
            ]}
            columnViewability={{
               library_number: false,
               _rarity: false,
               value: show_value,
               value_mlb: show_value_mlb,
               turns: show_turns,
               times: show_times,
               condition: show_condition,
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
   columnHelper.accessor("cost", {
      header: "Cost",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("max_atk", {
      header: "ATK",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1 text-xs">
               <span>{info.getValue().toLocaleString()}</span>
            </div>
         );
      },
   }),
   columnHelper.accessor("max_hp", {
      header: "HP",
      cell: (info) => {
         return (
            <div className="flex items-center gap-1 text-xs">
               <span>{info.getValue().toLocaleString()}</span>
            </div>
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
            <div className="flex items-center gap-1 text-xs">
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
   columnHelper.accessor("value_mlb", {
      header: "MLB",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1 text-xs">
               <span>
                  {this_effect?.value_mlb}
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
               )?.value_mlb,
            ) -
            parseFloat(
               B?.original?.effect_list?.find(
                  (a) => a.effect?.id == B?.original?.effect_id,
               )?.value_mlb,
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
            <div className="flex items-center gap-1 text-xs">
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
            <div className="flex items-center gap-1 text-xs">
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
   columnHelper.accessor("condition", {
      header: "Condition",
      cell: (info) => {
         const this_effect = info.row?.original?.effect_list?.find(
            (a) => a.effect?.id == info.row?.original?.effect_id,
         );
         return (
            <div className="flex items-center gap-1 text-xs">
               <span>{this_effect?.condition_notes}</span>
            </div>
         );
      },
      sortingFn: (A, B, columnId) => {
         return A?.original?.effect_list
            ?.find((a) => a.effect?.id == A?.original?.effect_id)
            ?.condition_notes?.toLowerCase() <
            B?.original?.effect_list
               ?.find((a) => a.effect?.id == B?.original?.effect_id)
               ?.condition_notes.toLowerCase()
            ? 1
            : -1;
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

function checkFieldHasEntry(data: any, fieldName: any) {
   const field_array = data?.effect?.ce_With_Effect
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
