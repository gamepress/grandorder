import {
   Disclosure,
   DisclosureButton,
   DisclosurePanel,
} from "@headlessui/react";
import clsx from "clsx";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2Plain } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function Availability({ data }: { data: any }) {
   const servant = data.servant;
   return (
      <>
         <SummonAvailability data={servant} />
         <FutureBanners data={data} />
      </>
   );
}

function SummonAvailability({ data: servant }: { data: ServantType }) {
   const availability = servant.summon_availability;

   return (
      <>
         <div className="bg-2-sub shadow-1 shadow-sm rounded-lg p-3 border border-color-sub">
            <span className="font-bold">{availability?.name}</span>
            <span>
               {" "}
               - {availability?.description.replace(/<[^>]*>?/gm, "")}
            </span>
         </div>
      </>
   );
}

function FutureBanners({ data }: { data: any }) {
   // Sort Banners descending by date!
   const today = new Date().getTime();
   const banners = data.bannerData.sort(
      (a, b) =>
         new Date(b.jp_start_date).getTime() -
         new Date(a.jp_start_date).getTime(),
   );
   const past_banners = banners.filter(
      (a) => a.na_end_date && new Date(a.na_end_date)?.getTime() < today,
   );
   const future_banners = banners.filter(
      (a) => !a.na_end_date || new Date(a.na_end_date).getTime() >= today,
   );
   const servant = data.servant;
   // console.log(banners);

   return (
      <>
         {banners && banners.length > 0 ? (
            <>
               <H2Plain text="Future Banners" />
               <Table grid dense framed>
                  <TableBody>
                     <TableRow>
                        <TableHeader>
                           Banner (Add 2 years for NA Date)
                        </TableHeader>
                        <TableHeader>JP Period</TableHeader>
                     </TableRow>
                     {future_banners.map((b: any) => {
                        const btype = b.servant_profile_future_banner?.find(
                           (s: any) => s?.banner_servant?.id == servant?.id,
                        )?.banner_reference;

                        var typedisplay = "";
                        switch (btype) {
                           case "single":
                              typedisplay = "Single";
                              break;
                           case "shared":
                              typedisplay = "Shared";
                              break;
                           case "guaranteed_gacha":
                           case "guaranteed-gacha":
                           case "guaranteed":
                              typedisplay = "Guaranteed Gacha";
                              break;
                           case "class-based":
                           case "class_based":
                              typedisplay = "Class-Based";
                              break;
                           default:
                              typedisplay = btype;
                        }
                        return (
                           <TableRow key={b.name}>
                              <TableCell>
                                 <Image
                                    height={256}
                                    className="h-32 mb-2"
                                    url={b.icon?.url}
                                    alt="Banner"
                                 />
                                 <div>{b.name}</div>
                              </TableCell>
                              <TableCell>
                                 <div>{b.jp_start_date}</div>
                                 <div>{b.jp_end_date}</div>
                                 <div>Banner Type: {typedisplay}</div>
                              </TableCell>
                           </TableRow>
                        );
                     })}
                  </TableBody>
               </Table>
            </>
         ) : null}
         {past_banners && past_banners.length > 0 ? (
            <Disclosure>
               {({ open }) => (
                  <>
                     <DisclosureButton
                        className="my-3 flex justify-between items-center gap-4 font-bold w-full p-2 rounded-lg bg-zinc-50
                      dark:bg-zinc-700 dark:border-zinc-600 border-zinc-300 shadow-1 shadow-sm border border-color-sub"
                     >
                        <div
                           className={clsx(
                              open ? "transform rotate-180" : "",
                              "dark:bg-zinc-600 bg-white rounded-full size-7 flex items-center justify-center",
                           )}
                        >
                           <Icon size={20} name="chevron-down" />
                        </div>
                        <span>Past Banners</span>
                        <div
                           className={clsx(
                              open ? "transform rotate-180" : "",
                              "dark:bg-zinc-600 bg-white rounded-full size-7 flex items-center justify-center",
                           )}
                        >
                           <Icon size={20} name="chevron-down" />
                        </div>
                     </DisclosureButton>
                     <DisclosurePanel className="space-y-3">
                        {past_banners.map((b: any) => (
                           <div
                              className="text-center overflow-hidden flex items-center w-full flex-col justify-center text-sm border border-color-sub rounded-lg"
                              key={b.name}
                           >
                              <Image
                                 height={250}
                                 url={b.icon?.url}
                                 className="h-32"
                                 alt="Banner"
                              />
                              <div className="py-2 font-bold border-t border-color-sub bg-2-sub w-full">
                                 {b.name}
                              </div>
                           </div>
                        ))}
                     </DisclosurePanel>
                  </>
               )}
            </Disclosure>
         ) : undefined}
      </>
   );
}
