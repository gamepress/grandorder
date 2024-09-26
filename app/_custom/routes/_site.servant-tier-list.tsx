import { useState } from "react";

import {
   Disclosure,
   DisclosureButton,
   DisclosurePanel,
} from "@headlessui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { createColumnHelper } from "@tanstack/react-table";
import clsx from "clsx";
import { gql } from "graphql-request";

import { Button } from "~/components/Button";
import { CustomPageHeader } from "~/components/CustomPageHeader";
import { Dialog } from "~/components/Dialog";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Text, TextLink } from "~/components/Text";
import type { Servant } from "~/db/payload-custom-types";
import { AdUnit } from "~/routes/_site+/_components/RampUnit";
import { fuzzyFilter } from "~/routes/_site+/c_+/_components/fuzzyFilter";
import { ListTable } from "~/routes/_site+/c_+/_components/ListTable";
import ListTableContainer from "~/routes/_site+/c_+/_components/ListTableContainer";
import { gqlFetch } from "~/utils/fetchers.server";

export async function loader({ params, request }: LoaderFunctionArgs) {
   const servantTierList = await gqlFetch({
      isCustomDB: true,
      isCached: true,
      query: QUERY,
      request,
   });
   return json(servantTierList);
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Servant Tier List | Fate/Grand Order Wiki - GamePress",
      },
   ];
};

export default function ServantTierList() {
   const data = useLoaderData<typeof loader>();

   const gridContainerClassNames =
      "grid grid-cols-5 tablet:grid-cols-8 gap-2 p-3 w-full";

   return (
      <>
         <CustomPageHeader
            name="Servant Tier List"
            iconUrl="https://static.mana.wiki/servant-tier-list-icon.png"
         />

         <div className="relative z-20 mx-auto max-w-[728px] justify-center max-tablet:px-3 tablet:pb-36">
            <div className="space-y-3 pt-4">
               <Text>
                  <p className="pb-1 font-bold">5★ Assumptions</p>
                  <p>
                     SSR Servants are assumed to be at NP1, 10/10/10 Skills.
                     Double Servant compositions are considered. All 5* Servants
                     are excellent! Their performance often vastly outpaces
                     those of lower rarities and each of them is worth investing
                     in. The tier list is therefore just a comparison tool to
                     judge these Servants by their relative performance. The
                     tier placement is primarily based on a Servant’s current
                     performance, and their placement will often shift with
                     future Interludes and Rank Ups, new competition, and the
                     changing state of the game.
                  </p>
               </Text>
               <Text>
                  <p className="pb-1 font-bold">4★ Assumptions</p>
                  <p>
                     Non-Welfare SR Servants are assumed to be at NP1, 10/10/10
                     Skills. Welfare SR Servants are assumed to be at NP5,
                     10/10/10 Skills. Double Servant compositions are
                     considered.
                  </p>
               </Text>
               <Text>
                  <p className="pb-1 font-bold">1-3★ Assumptions</p>
                  <p>
                     Non-Story Locked Servants are assumed to be at NP5,
                     10/10/10 Skills. Story-Locked (generally 3 star) Servants
                     are assumed to be at NP1, 10/10/10 Skills. Double Servant
                     compositions are considered.
                  </p>
               </Text>
               <Text>
                  *Servants in the same tier are listed in descending rarity,
                  and aside from this are in no particular order.
               </Text>
               <Text>
                  Check out the full{" "}
                  <TextLink
                     target="_blank"
                     href="https://fgo.gamepress.gg/tier-list-change-log-history"
                  >
                     change log{" "}
                  </TextLink>{" "}
                  for details on tier list changes
               </Text>
            </div>
            <Disclosure>
               {({ open }) => (
                  <>
                     <DisclosureButton
                        className={clsx(
                           open ? "rounded-b-none " : "mb-2.5 shadow-sm",
                           "shadow-1 mt-4 border-color-sub bg-2-sub flex w-full items-center gap-2 overflow-hidden rounded-lg border px-2 py-3",
                        )}
                     >
                        <div className="flex h-7 w-7 flex-none items-center justify-center rounded-full border bg-white shadow-sm shadow-zinc-200  dark:border-zinc-600/30 dark:bg-dark450 dark:shadow-zinc-800">
                           <Icon
                              name="chevron-right"
                              className={clsx(
                                 open ? "rotate-90" : "",
                                 "transform pl-0.5 transition duration-300 ease-in-out",
                              )}
                              size={16}
                           />
                        </div>
                        <div className="flex-grow text-left text-[15px] font-bold">
                           Tier Explanations
                        </div>
                     </DisclosureButton>
                     <DisclosurePanel
                        unmount={false}
                        className={clsx(
                           open ? "mb-3 border-t" : "",
                           "border-color-sub shadow-1 bg-3 rounded-b-lg border border-t-0 text-sm shadow-sm p-3",
                        )}
                     >
                        <Table grid framed dense>
                           <TableBody>
                              <TableRow>
                                 <TableHeader center>EX</TableHeader>
                                 <TableCell>
                                    The best of the best, these Servants can be
                                    put into any team and will vastly improve
                                    team performance by a significant margin.
                                    Their team support is so powerful that the
                                    most powerful teams revolve around them.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>EX-</TableHeader>
                                 <TableCell>
                                    Servants in this tier are extremely enabling
                                    and drastically improve the performance for
                                    many teams, although their usage is slightly
                                    more restricted and less widely applicable,
                                    being slightly more specialized than those
                                    in EX tier.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>A+</TableHeader>
                                 <TableCell>
                                    These Servants are among the best at their
                                    role. They either perform well in any team,
                                    or have access to a powerful specialization
                                    for the current state of the game.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>A</TableHeader>
                                 <TableCell>
                                    Powerful Servants that are among the top in
                                    performing their role in the current state
                                    of the game. They are often self-sufficient,
                                    or their outstanding performance in specific
                                    setups lends them high desirability.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>B+</TableHeader>
                                 <TableCell>
                                    Servants that are a solid asset to the
                                    roster. These Servants often have a single
                                    very powerful role for which they excel,
                                    while still performing decently outside of
                                    that role.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>B</TableHeader>
                                 <TableCell>
                                    Strong Servants with great potential.
                                    Typically they have some weaknesses that can
                                    be readily compensated for by supports.
                                    Against the right opponents or with the
                                    right composition, their specializations
                                    will outperform higher tier Servants.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>C+</TableHeader>
                                 <TableCell>
                                    These Servants provide very good performance
                                    in their ideal encounters. Generally, their
                                    specializations may be more rare, or they
                                    may not necessarily be a choice pick in all
                                    occasions, but still find value outside
                                    their niche.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>C</TableHeader>
                                 <TableCell>
                                    The workhorses, Servants with good
                                    performance who will shine with the right
                                    team and against the right opponents. They
                                    typically have a solid niche of their own
                                    and can carry a team to victory even against
                                    the most difficult opponents.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>D+</TableHeader>
                                 <TableCell>
                                    Servants with decent performance that are
                                    somewhat less self-sufficient. They may also
                                    be extremely competent in a niche that is
                                    somewhat less commonly encountered.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center>D-</TableHeader>
                                 <TableCell>
                                    Solid Servants, who often require more
                                    support to fully make use of. They typically
                                    face stronger competition in their role,
                                    lack the support necessary to show their
                                    true potential, or have a distinct weakness
                                    in their kit. Regardless, they will easily
                                    outperform most lower rarity Servants.
                                 </TableCell>
                              </TableRow>
                              <TableRow>
                                 <TableHeader center className="!border-0">
                                    E
                                 </TableHeader>
                                 <TableCell>
                                    Servants who either have competition too
                                    strong for their specialization or who lack
                                    a strong specialization. Often they have a
                                    future upgrade to look forward to that
                                    shifts their placement. They will perform
                                    decently nonetheless and still put up a
                                    great performance with the right support.
                                 </TableCell>
                              </TableRow>
                           </TableBody>
                        </Table>
                     </DisclosurePanel>
                  </>
               )}
            </Disclosure>
            <div className="relative z-20 mx-auto max-w-[728px] justify-center">
               <AdUnit
                  enableAds={true}
                  adType={{
                     desktop: "leaderboard_atf",
                     tablet: "leaderboard_atf",
                     mobile: "med_rect_atf",
                  }}
                  className="my-4 mx-auto flex items-center justify-center"
                  selectorId="tier-list-1"
               />
            </div>
            <ListTableContainer
               className="border border-color-sub rounded-lg divide-y divide-color-sub overflow-hidden"
               /* @ts-ignore */
               filters={filters}
            >
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        EX
                     </div>
                  </div>
                  <ListTable
                     pager={false}
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.exTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        EX-
                     </div>
                  </div>
                  <ListTable
                     pager={false}
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.exMinusTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        A+
                     </div>
                  </div>
                  <ListTable
                     pager={false}
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.aPlusTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                      dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                      rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        A
                     </div>
                  </div>
                  <ListTable
                     pager={false}
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.aTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        B+
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.bPlusTier.docs } }}
                     columns={columns}
                     pager={false}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        B
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.bTier.docs } }}
                     columns={columns}
                     pager={false}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark400 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        C+
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.cPlusTier.docs } }}
                     columns={columns}
                     pager={false}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        C
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.cTier.docs } }}
                     columns={columns}
                     pager={false}
                     columnViewability={{ star_rarity: false }}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>

               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        D+
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.dPlusTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     pager={false}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        D
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.dTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     pager={false}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
               <div className="flex items-stretch max-tablet:flex-col max-tablet:divide-y tablet:divide-x divide-color-sub">
                  <div className="p-3 w-full tablet:w-16 mx-auto flex tablet:items-start tablet:justify-center bg-2-sub">
                     <div
                        className="bg-white shadow-sm shadow-1 border border-zinc-300 
                        dark:bg-dark450 dark:border-zinc-600 text-sm px-2  tablet:w-20
                        rounded-lg p-1 flex items-center justify-center font-bold"
                     >
                        E
                     </div>
                  </div>
                  <ListTable
                     gridView={gridView}
                     searchPlaceholder="Filter by Servant name..."
                     defaultViewType="grid"
                     //@ts-ignore
                     data={{ listData: { docs: data.eTier.docs } }}
                     columns={columns}
                     columnViewability={{ star_rarity: false }}
                     pager={false}
                     gridCellClassNames=" "
                     gridContainerClassNames={gridContainerClassNames}
                  />
               </div>
            </ListTableContainer>
         </div>
      </>
   );
}

const columnHelper = createColumnHelper<Servant>();

const gridView = columnHelper.accessor("name", {
   filterFn: fuzzyFilter,
   cell: (info) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [isOpen, setIsOpen] = useState(false);

      return (
         <div>
            <Link
               to={`/c/servants/${info.row.original.slug}`}
               className={clsx(
                  info.row.original.np_card_type?.name &&
                     info.row.original.np_card_type?.name == "Arts" &&
                     "bg-blue-100 border-blue-300 dark:bg-blue-950/50 dark:border-blue-900/70",
                  info.row.original.np_card_type?.name &&
                     info.row.original.np_card_type?.name == "Quick" &&
                     "bg-green-100 border-green-300 dark:bg-green-950/50 dark:border-green-900/70",
                  info.row.original.np_card_type?.name &&
                     info.row.original.np_card_type?.name == "Buster" &&
                     "bg-red-100 border-red-300/80 dark:bg-red-950/50 dark:border-red-900/70",
                  "relative flex flex-col group h-full border border-color mb-1 rounded-lg p-1 shadow-sm shadow-1",
               )}
            >
               <Image
                  width={160}
                  className="w-20 mx-auto"
                  loading="lazy"
                  url={info.row.original.icon?.url}
               />
               <div className="flex items-center gap-0.5 justify-center pt-1">
                  {Array(parseInt(info.row.original.star_rarity?.name as any))
                     .fill(0)
                     .map((x) => (
                        <Image
                           key={x}
                           width={80}
                           url={info.row.original.star_rarity?.icon?.url}
                           className="object-contain size-2.5"
                        />
                     ))}
               </div>
               <div className="uppercase text-[9px] block font-bold pt-0.5 text-1 text-center">
                  {info.row.original.np_target_type}
               </div>
            </Link>
            {info.row.original.writeup_tier_list_explanation ? (
               <Button
                  color="light/zinc"
                  className="!text-[10px] !text-1 w-full !p-0"
                  onClick={() => setIsOpen(true)}
               >
                  Info
               </Button>
            ) : null}
            <div
               className="text-[10px] font-bold text-center pt-1
                     group-hover:underline decoration-zinc-400 underline-offset-2"
            >
               {info.getValue()}
            </div>
            <Dialog
               size="3xl"
               onClose={() => {
                  setIsOpen(false);
               }}
               open={isOpen}
            >
               <div
                  className="whitespace-normal"
                  dangerouslySetInnerHTML={{
                     //@ts-ignore
                     __html: info.row.original.writeup_tier_list_explanation,
                  }}
               ></div>
            </Dialog>
         </div>
      );
   },
});

const columns = [
   columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
         <Link
            to={`/c/servants/${info.row.original.slug ?? info.row.original.id}`}
            className="flex items-center gap-2 group py-0.5"
         >
            <Image
               width={120}
               className="w-7 flex-none"
               loading="lazy"
               url={info.row.original.icon?.url}
            />
            <span className="font-bold group-hover:underline decoration-zinc-400 underline-offset-2">
               <span>{info.getValue()}</span>
            </span>
         </Link>
      ),
   }),
   columnHelper.accessor("class", {
      header: "Class",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.class?.name);
      },
      cell: (info) => info.getValue()?.name,
   }),
   columnHelper.accessor("star_rarity", {
      header: "Rarity",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.star_rarity?.name);
      },
      cell: (info) => info.getValue()?.name,
   }),
   columnHelper.accessor("np_target_type", {
      header: "Target",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.np_target_type);
      },
      cell: (info) =>
         info.getValue() === "support"
            ? "Support"
            : info.getValue()?.toUpperCase(),
   }),
   columnHelper.accessor("np_card_type", {
      header: "Card",
      filterFn: (row, columnId, filterValue) => {
         return filterValue.includes(row.original.np_card_type?.name);
      },
      cell: (info) => info.getValue()?.name,
   }),
];
const filters = [
   {
      id: "class",
      label: "Class",
      cols: 2,
      options: [
         {
            value: "Saber",
            label: "Saber",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_1_GoldSaber.png",
         },
         {
            value: "Archer",
            label: "Archer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_2_Gold_Archer.png",
         },
         {
            value: "Lancer",
            label: "Lancer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_3_Gold_Lancer.png",
         },
         {
            value: "Rider",
            label: "Rider",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_4_Gold_Rider.png",
         },
         {
            value: "Caster",
            label: "Caster",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_5_Gold_Caster.png",
         },
         {
            value: "Assassin",
            label: "Assassin",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_6_Gold_Assassin.png",
         },
         {
            value: "Berserker",
            label: "Berserker",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_7_Gold_Berserker.png",
         },
         {
            value: "Shielder",
            label: "Shielder",

            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_8_Gold_Shielder.png",
         },
         {
            value: "Ruler",
            label: "Ruler",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_9_Gold_Ruler.png",
         },
         {
            value: "Avenger",
            label: "Avenger",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_11_Gold_Avenger.png",
         },
         {
            value: "Alter Ego",
            label: "Alter Ego",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_10_Gold_AlterEgo.png",
         },
         {
            value: "Moon Cancer",
            label: "Moon Cancer",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_23_MoonCancer.png",
         },
         {
            value: "Foreigner",
            label: "Foreigner",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_25_Gold_Foreigner.png",
         },
         {
            value: "Pretender",
            label: "Pretender",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_28_Gold_Pretender.png",
         },
         {
            value: "Beast",
            label: "Beast",
            icon: "https://static.mana.wiki/grandorder/FGOClassIcon_3_33_Gold_Beast.png",
         },
      ],
   },
   {
      id: "star_rarity",
      label: "Rarity",
      cols: 3,
      options: [
         {
            label: "5 ★",
            value: "5",
         },
         {
            label: "4 ★",
            value: "4",
         },
         {
            label: "3 ★",
            value: "3",
         },
         {
            label: "2 ★",
            value: "2",
         },
         {
            label: "1 ★",
            value: "1",
         },
         {
            label: "0 ★",
            value: "0",
         },
      ],
   },
   {
      id: "np_card_type",
      label: "Card Type",
      cols: 3,
      options: [
         {
            label: "Arts",
            value: "Arts",
            icon: "https://static.mana.wiki/grandorder/FGOCommandCard_Arts.png",
         },
         {
            label: "Buster",
            value: "Buster",
            icon: "https://static.mana.wiki/grandorder/FGOCommandCard_Buster.png",
         },
         {
            label: "Quick",
            value: "Quick",
            icon: "https://static.mana.wiki/grandorder/FGOCommandCard_Quick.png",
         },
      ],
   },
   {
      id: "np_target_type",
      label: "Target Type",
      cols: 3,
      options: [
         {
            label: "AOE",
            value: "aoe",
         },
         {
            label: "Support",
            value: "support",
         },
         {
            label: "ST",
            value: "st",
         },
      ],
   },
];

const QUERY = gql`
   query {
      exTier: Servants(
         where: { tier_list_score: { equals: 100 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      exMinusTier: Servants(
         where: { tier_list_score: { equals: 99 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      aPlusTier: Servants(
         where: { tier_list_score: { equals: 91 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      aTier: Servants(
         where: { tier_list_score: { equals: 90 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      bPlusTier: Servants(
         where: { tier_list_score: { equals: 81 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      bTier: Servants(
         where: { tier_list_score: { equals: 80 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      cPlusTier: Servants(
         where: { tier_list_score: { equals: 71 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      cTier: Servants(
         where: { tier_list_score: { equals: 70 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      dTier: Servants(
         where: { tier_list_score: { equals: 60 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      dPlusTier: Servants(
         where: { tier_list_score: { equals: 61 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      dTier: Servants(
         where: { tier_list_score: { equals: 60 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
      eTier: Servants(
         where: { tier_list_score: { equals: 50 } }
         limit: 100
         sort: "name"
      ) {
         totalDocs
         docs {
            id
            slug
            name
            np_target_type
            tier_arrow
            writeup_tier_list_explanation
            np_card_type {
               name
            }
            class {
               name
               icon {
                  url
               }
            }
            star_rarity {
               name
               icon {
                  url
               }
            }
            icon {
               id
               url
            }
         }
      }
   }
`;
