import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import { gql } from "graphql-request";
import { Avatar } from "~/components/Avatar";

import { Image } from "~/components/Image";
import type { ServantSkillEffects } from "payload/generated-custom-types";
import { fetchList } from "~/routes/_site+/c_+/$collectionId/utils/fetchList.server";
import { listMeta } from "~/routes/_site+/c_+/$collectionId/utils/listMeta";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { List } from "~/routes/_site+/c_+/_components/List";
import { useLoaderData } from "@remix-run/react";

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

   return json({
      list,
   });
}

export default function ServantSkillEffects() {
   // @ts-ignore
   const { list } = useLoaderData();

   return (
      <>
         <List
            gridView={gridView}
            columns={columns}
            //defaultFilters={urlFilters}
            pageSize={100}
            paginationShowGoToPage={true}
         />
      </>
   );
}

const columnHelper = createColumnHelper<ServantSkillEffect>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => (
      <Link
         className="block relative"
         to={`/c/servant-skill-effects/${
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
   columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
         <Link
            to={`/c/servant-skill-effects/${
               info.row.original.slug ?? info.row.original.id
            }`}
            className="flex items-center gap-2 group py-0.5"
         >
            <div className="size-7 flex-none grid align-middle text-center leading-7 dark:bg-dark450 bg-white rounded-full border border-gray-500 border-opacity-20">
               {info.row.original.icon?.url ? (
                  <Image
                     width={36}
                     height={36}
                     url={info.row.original.icon?.url}
                     className="mx-auto"
                     options="aspect_ratio=1:1&height=80&width=80"
                  />
               ) : (
                  info.row.original.name.charAt(0)
               )}
            </div>
            <span className="font-semibold group-hover:underline decoration-zinc-400 underline-offset-2">
               {info.getValue()}
            </span>
         </Link>
      ),
   }),
];

// Add stats under atk_lv120 later.
const QUERY = gql`
   query {
      listData: ServantSkillEffects(
         limit: 5000
         sort: "name"
         where: { hide_entry: { not_equals: true } }
      ) {
         docs {
            id
            name
            slug
            icon {
               url
            }
            hide_entry
         }
      }
   }
`;
