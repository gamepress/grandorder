import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";
import { z } from "zod";
import { zx } from "zodix";

import { Badge } from "~/components/Badge";
import { Image } from "~/components/Image";
import type { CommandCode } from "payload/generated-custom-types";
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
         rarity: true,
         desc_effect: true,
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
         rarity: false,
         desc_effect: false,
         effect_list: true,
      },
   },
];

export default function CommandCodes() {
   // @ts-ignore
   const { list, viewtab, filterstate } = useLoaderData();
   const ce_effect_list = list.CraftEssenceEffects?.docs;

   const ccfilt = list?.listData?.docs
      ?.map((a) => a.effect_list?.map((b) => b.effect?.id))
      .flat()
      .flat()
      .filter((v, i, a) => a.indexOf(v) === i);

   const cc_effect_list = ce_effect_list.filter((eff) =>
      ccfilt.includes(eff.id),
   );

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
         options: cc_effect_list.map((eff) => {
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
         <h2 className="px-4 h-8 flex items-center mb-2 w-full">
            Show Columns
         </h2>
         <div className="grid grid-cols-2 gap-2">
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

const columnHelper = createColumnHelper<CommandCode>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/command-codes/${
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
   columnHelper.accessor("command_code_id", {
      header: "Id",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return info.getValue();
      },
   }),
   columnHelper.accessor("name", {
      header: "Command Code",
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
                     <span className="font-bold whitespace-pre-wrap">
                        {info.getValue()}
                     </span>
                  </div>
               </span>
            </Link>
         );
      },
   }),
   columnHelper.accessor("icon", {
      header: "CC",
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
               <span>{info.getValue()?.name}</span>
            </div>
         );
      },
   }),

   // Description
   columnHelper.accessor("desc_effect", {
      header: "Description",
      filterFn: fuzzyFilter,
      cell: (info) => {
         return (
            <div className="items-center">
               <div className="text-sm whitespace-pre-wrap">
                  {info.getValue()}
               </div>
               <div
                  className="text-xs text-gray-400 dark:text-gray-500 whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                     __html: info.row?.original?.acquisition_method,
                  }}
               ></div>
            </div>
         );
      },
   }),

   // CE Effects
   columnHelper.accessor("effect_list", {
      header: "Effects",
      filterFn: (row, columnId, filterValue) => {
         return filterValue
            ?.map(
               (a) =>
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
      listData: CommandCodes(
         limit: 5000
         sort: "command_code_id"
         where: { command_code_id: { not_equals: null } }
      ) {
         docs {
            id
            name
            command_code_id
            desc_effect
            acquisition_method
            icon {
               url
            }
            rarity {
               name
            }
            effect_image {
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
