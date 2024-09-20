import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";

import { Badge } from "~/components/Badge";
import { CustomPageHeader } from "~/components/CustomPageHeader";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { AdUnit } from "~/routes/_site+/_components/RampUnit";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";
import { gqlFetch } from "~/utils/fetchers.server";
import { rankItem } from "@tanstack/match-sorter-utils";
import type { FilterFn } from "@tanstack/react-table";

import { SummonNavigation } from "./_site.summon-simulator";

export async function loader({
   context: { payload, user },
   request,
}: LoaderFunctionArgs) {
   const summonEventList = await gqlFetch({
      isCustomDB: true,
      isCached: true,
      query: SummonEventListQuery,
      request,
   });

   return json({
      //@ts-ignore
      summonEventList: summonEventList?.SummonEvents?.docs,
   });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Summon Banner List | Fate/Grand Order Wiki - GamePress",
      },
      {
         name: "description",
         content:
            "A historical list of Summon Events and which Servants were available from each banner.",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const columnHelper = createColumnHelper<any>();

const servantFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
   // Get array of Servant information
   const servant_list = row.original?.servant_profile_future_banner
      ?.filter(
         //@ts-ignore
         (a) =>
            a.banner_reference == "single" || a.banner_reference == "shared",
      )
      //@ts-ignore
      ?.map((a) => a.banner_servant?.name)
      ?.toString();

   const servant_found =
      servant_list.toLowerCase()?.indexOf(value?.toLowerCase()) > -1;

   // Return if the item should be filtered in/out
   return servant_found;
};

const gridView = columnHelper.accessor("name", {
   filterFn: servantFilter,
   cell: (info) => (
      <div className="block relative">
         <Image
            height={36}
            url={info.row.original.icon?.url}
            className="mx-auto"
         />
         <div
            className="truncate text-xs font-semibold text-center pt-1
               group-hover:underline decoration-zinc-400 underline-offset-2"
         >
            {info.getValue()}
         </div>
      </div>
   ),
});

const columns = [
   columnHelper.accessor("name", {
      filterFn: servantFilter,
      header: "Name",
      cell: (info) => {
         return (
            <div className="flex flex-col gap-2 group py-0.5 w-72  whitespace-normal">
               <Image
                  width={480}
                  height={173}
                  className="flex-none"
                  url={info.row.original.icon?.url}
               />
               <span className="font-semibold text-xs group-hover:underline decoration-zinc-400 underline-offset-2">
                  {info.getValue()}
               </span>
            </div>
         );
      },
   }),
   columnHelper.accessor("details", {
      header: "Details",
      cell: (info) => (
         <div className="p-2">
            <div className="border-b border-color-sub pb-2">
               <Badge color="violet" className="mb-1">
                  Period
               </Badge>
               <ul className="list-disc ml-6 space-y-1">
                  {info.row?.original.jp_start_date &&
                     info.row?.original.jp_end_date && (
                        <li>
                           <div className="text-xs flex items-center gap-1">
                              <div className="font-bold">Japan:</div>
                              <div>{info.row?.original.jp_start_date}</div>
                              <span>to</span>
                              <div>{info.row?.original.jp_end_date}</div>
                           </div>
                        </li>
                     )}
                  {info.row?.original.na_start_date &&
                     info.row?.original.na_end_date && (
                        <li>
                           <div className="text-xs flex items-center gap-1">
                              <div className="font-bold">NA:</div>
                              <div>{info.row?.original.na_start_date}</div>
                              <span>to</span>
                              <div>{info.row?.original.na_end_date}</div>
                           </div>
                        </li>
                     )}
               </ul>
            </div>
            {info.row?.original.servant_profile_future_banner?.filter(
               // @ts-ignore
               (s) => s.banner_reference == "single",
            ).length > 0 && (
               <>
                  <Badge className="mt-3 mb-1">Single</Badge>
                  <ul className="list-disc ml-6 space-y-1">
                     <li>
                        <div className="whitespace-normal text-xs">
                           {info.row?.original.servant_profile_future_banner
                              ?.filter(
                                 // @ts-ignore
                                 (s) => s.banner_reference == "single",
                              )
                              // @ts-ignore
                              ?.map((s, si, sf) => (
                                 <span key={s.banner_servant?.name + "_" + si}>
                                    <Link
                                       className="text-blue-500 hover:underline"
                                       to={`/c/servants/${s.banner_servant?.slug}`}
                                    >
                                       <span>{s.banner_servant?.name}</span>
                                    </Link>
                                    <span>
                                       {si + 1 === sf.length ? "" : ", "}
                                    </span>
                                 </span>
                              ))}
                        </div>
                     </li>
                  </ul>
               </>
            )}
            {info.row?.original.servant_profile_future_banner?.filter(
               // @ts-ignore
               (s) => s.banner_reference == "shared",
            ).length > 0 && (
               <>
                  <Badge className="mt-3 mb-1">Shared</Badge>
                  <ul className="list-disc ml-6 space-y-1">
                     <li>
                        <div className="whitespace-normal text-xs">
                           {info.row?.original.servant_profile_future_banner
                              ?.filter(
                                 // @ts-ignore
                                 (s) => s.banner_reference == "shared",
                              )
                              // @ts-ignore
                              ?.map((s, si, sf) => (
                                 <span key={s}>
                                    <Link
                                       className="text-blue-500 hover:underline"
                                       to={`/c/servants/${s.banner_servant?.slug}`}
                                    >
                                       <span>{s.banner_servant?.name}</span>
                                    </Link>
                                    <span>
                                       {si + 1 === sf.length ? "" : ", "}
                                    </span>
                                 </span>
                              ))}
                        </div>
                     </li>
                  </ul>
               </>
            )}
         </div>
      ),
   }),
];

export default function SummonBannerList(data: any) {
   //need banners, weapons, characters
   const loaderdata = useLoaderData<typeof loader>();

   const bannerlist = loaderdata?.summonEventList;

   return (
      <>
         <CustomPageHeader
            name="Summon Banner List"
            iconUrl="https://static.mana.wiki/FGO%20Center%20Banner%20Summon%20Banner%20List.png"
         />
         <div className="relative z-20 mx-auto max-w-[728px] justify-center max-tablet:px-3 tablet:pb-36">
            <SummonNavigation />
            <div className="mb-6">
               <div className="pb-3 text-sm">
                  Below is a historical list of Summon Events and which Servants
                  were / will be available from each banner.
               </div>
               <Table grid framed dense>
                  <TableBody>
                     <TableRow>
                        <TableHeader>Single</TableHeader>
                        <TableCell>
                           Servant is featured as the only rate-up Servant of
                           their rarity for at least one of the days of the
                           Summoning Campaign.
                        </TableCell>
                     </TableRow>
                     <TableRow>
                        <TableHeader className="!border-0">Shared</TableHeader>
                        <TableCell>
                           Servant is rate-up with at least one other Servant
                           with the same rarity at all times they are available
                           during the Summoning Campaign (rates of their
                           appearance are subsequently divided/lower as a
                           result).
                        </TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
            </div>
            <AdUnit
               enableAds={true}
               adType={{
                  desktop: "leaderboard_atf",
                  tablet: "leaderboard_atf",
                  mobile: "med_rect_atf",
               }}
               className="my-8 mx-auto flex items-center justify-center"
               selectorId="summon-banner-list"
            />
            <ListTable
               gridView={gridView}
               data={{ listData: { docs: bannerlist } }}
               columns={columns}
               pageSize={1000}
               globalFilterFn={servantFilter}
            />
         </div>
      </>
   );
}

const SummonEventListQuery = `
   query {
      SummonEvents(limit: 1000, sort: "-sim_number") {
         docs {
            id
            name
            sim_number
            jp_start_date
            jp_end_date
            na_start_date
            na_end_date
            icon {
               url
            }
            servant_profile_future_banner {
               banner_servant {
                  id
                  slug
                  name
               }
               banner_reference
            }
         }
      }
   }
`;
