import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";
import { z } from "zod";
import { zx } from "zodix";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import type { CraftEssence } from "payload/generated-custom-types";
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
         _rarity: true,
         base_hp: false,
         base_atk: false,
         max_hp: false,
         max_atk: false,
         effect_list: false,
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
         _rarity: false,
         base_hp: true,
         base_atk: true,
         max_hp: true,
         max_atk: true,
         effect_list: false,
      },
   },
   {
      name: "effects",
      label: "Effects",
      setting: {
         name: true,
         icon: false,
         type: false,
         class: false,
         _rarity: false,
         base_hp: false,
         base_atk: false,
         max_hp: false,
         max_atk: false,
         effect_list: true,
      },
   },
];

export default function CraftEssences() {
   // @ts-ignore
   const { list, viewtab, filterstate } = useLoaderData();
   const ce_effect_list = list.CraftEssenceEffects?.docs;

   const urlFilters = filterstate
      ? JSON.parse(decodeURIComponent(filterstate))
      : [];

   // If the viewtab setting is legal, use it, otherwise default
   const [colView, setColView] = useState(
      colViewSettings.find((a) => a.name == viewtab) ? viewtab : "default",
   );

   const currCols =
      colViewSettings.find((a) => a.name == colView)?.setting ?? {};

   const filters = [
      {
         id: "_rarity",
         label: "Rarity",
         cols: 5 as const,
         options: [
            {
               value: "1911",
               label: "1 ★",
            },
            {
               value: "1916",
               label: "2 ★",
            },
            {
               value: "1921",
               label: "3 ★",
            },
            {
               value: "1926",
               label: "4 ★",
            },
            {
               value: "1946",
               label: "5 ★",
            },
         ],
      },
      {
         id: "effect_list",
         label: "Effect",
         cols: 1 as const,
         options: ce_effect_list.map((eff) => {
            return {
               value: eff.id,
               label: eff.name,
               icon: eff.icon?.url,
            };
         }),
      },
   ];

   return (
      <>
         {urlFilters?.length > 0 ? (
            <List
               gridView={gridView}
               columns={columns}
               columnViewability={currCols}
               filters={filters}
               defaultFilters={urlFilters}
               pageSize={100}
               paginationShowGoToPage={true}
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
               pageSize={100}
               paginationShowGoToPage={true}
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
         <a href="/c/craft-essence-effects">
            <div className="text-blue-500 font-bold border rounded-md p-2 my-2 text-center cursor-pointer dark:border-blue-400">
               See Full List of Craft Essence Effects Here!
            </div>
         </a>
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

const columnHelper = createColumnHelper<CraftEssence>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/craft-essences/${
            info.row.original.slug ?? info.row.original.id
         }`}
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
   columnHelper.accessor("library_number", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Craft Essence",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/craft-essences/${
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
                     <span className="text-xs text-1">
                        {info.row.original.class?.name}
                     </span>
                  </div>
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("icon", {
      header: "CE",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <Link
               to={`/c/craft-essences/${
                  info.row.original.slug ?? info.row.original.id
               }`}
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
   columnHelper.accessor("_rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row?.original?._rarity?.id);
      },
      cell: (info) => {
         return (
            <div className="flex items-center gap-1">
               <span>{info.getValue()?.name}</span>
            </div>
         );
      },
   }),

   // Stats
   columnHelper.accessor("base_hp", {
      header: "HP Base",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("base_atk", {
      header: "ATK Base",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("max_hp", {
      header: "HP Max",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("max_atk", {
      header: "ATK Max",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),

   // CE Effects
   columnHelper.accessor("effect_list", {
      header: "Effects",
      filterFn: (row, columnId, filterValue) => {
         return filterValue
            ?.map((a) =>
               row?.original?.effect_list
                  ?.map((el) => el.effect?.id)
                  ?.includes(a),
            )
            ?.every((v) => v === true);
      },
      cell: (info) => {
         return (
            <div className="flex flex-wrap items-center gap-1">
               {info.row.original.effect_list?.map((eff) => {
                  return (
                     <>
                        <div className="border rounded-md p-2 text-center overflow-clip">
                           <div className="block">
                              <Image
                                 className="inline-block align-middle"
                                 width={20}
                                 url={eff.effect.icon?.url}
                                 options="width=80"
                              />
                              <div className="align-middle inline-block ml-2 text-xs">
                                 {eff.effect?.name}
                              </div>
                           </div>
                           <div className="align-middle inline-block text-xs">
                              {eff.value}
                              {eff.value_type == "percent" ? "%" : ""}
                              {eff.value_mlb ? " | MLB: " + eff.value_mlb : ""}
                              {eff.value_type == "percent" ? "%" : ""}
                           </div>
                        </div>
                     </>
                  );
               })}
            </div>
         );
      },
   }),
];

// Add stats under atk_lv120 later.
const QUERY = gql`
   query {
      listData: CraftEssences(
         limit: 5000
         sort: "library_number"
         where: { library_number: { not_equals: null } }
      ) {
         docs {
            id
            name
            library_number
            cost
            base_hp
            max_hp
            base_atk
            max_atk
            servant {
               name
               icon {
                  url
               }
            }
            icon {
               url
            }
            _rarity {
               name
            }
            _ce_Type_Image {
               icon {
                  url
               }
            }
            effect_list {
               effect {
                  id
                  name
                  icon {
                     url
                  }
               }
               value
               value_mlb
               value_type
            }
            slug
         }
      }

      CraftEssenceEffects(limit: 1000, sort: "name") {
         docs {
            id
            name
            icon {
               url
            }
         }
      }
   }
`;
