import { useState } from "react";

import clsx from "clsx";

import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Table, TableCell, TableHeader, TableRow } from "~/components/Table";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

export function NoblePhantasm({ data }: { data: any }) {
   const servant = data.servant;
   const np = servant?.noble_phantasm_base;

   return (
      <>
         <SectionTitle customTitle="Noble Phantasm" />
         <NoblePhantasmDisplay np={np} />
      </>
   );
}

const NoblePhantasmDisplay = ({ np }: any) => {
   const np_name = np.name;
   const np_description = np.description;
   const np_overcharge = np.description_overcharge;
   const np_card_icon = np.card_type?.icon?.url;
   const np_rank = np.rank;
   const video_link = np.video_link
      ? np.video_link.split("=")?.[1]?.replace(/\?.*/g, "") +
        (np.video_link?.split("=")?.[2]
           ? "?start=" + np.video_link?.split("=")?.[2]
           : "")
      : null;
   // const np_sub = np.sub_name;
   const np_classification = np.np_classification?.name;
   const np_hit_count = np.hit_count;
   const np_effect_list = np.effect_list;
   const np_effect_list_overcharge = np.effect_list_overcharge;
   const unlock = np.unlock_condition;
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="p-3 border border-color-sub rounded-lg mb-3 shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
            {/* Main Noble Phantasm Information */}
            <section>
               <div className="flex items-start gap-3">
                  <div className="flex-grow">
                     <div className="flex items-start justify-between pb-1">
                        <div className="flex items-start gap-2 text-sm">
                           <div className="size-10 flex-none">
                              <Image url={np_card_icon} height={80} />
                           </div>
                           <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm">
                                 <span className="font-bold">{np_name}</span>
                                 <span className="text-1">{np_rank}</span>
                              </div>
                              <div
                                 className="text-xs whitespace-pre-wrap leading-tight"
                                 dangerouslySetInnerHTML={{
                                    __html: np_description
                                       .replace(/\<br\>/g, "")
                                       .replace(/\<p\>\r\n/g, "<p>"),
                                 }}
                              />
                              <div className="space-y-1">
                                 {unlock ? (
                                    <div
                                       className="text-xs"
                                       dangerouslySetInnerHTML={{
                                          __html: unlock,
                                       }}
                                    ></div>
                                 ) : null}
                                 <div className="font-bold text-xs">
                                    {"<Overcharge>"}
                                 </div>
                                 <div
                                    className="text-xs whitespace-pre-wrap leading-tight"
                                    dangerouslySetInnerHTML={{
                                       __html: np_overcharge
                                          .replace(/\<br\>/g, "")
                                          .replace(/\<p\>\r\n/g, "<p>"),
                                    }}
                                 ></div>
                              </div>
                           </div>
                        </div>
                        <button
                           onClick={() => setOpen(!open)}
                           className={clsx(
                              open
                                 ? "bg-blue-100 text-blue-600 border-blue-300 dark:text-blue-200 dark:bg-blue-900 dark:border-blue-800"
                                 : "bg-blue-50 border-blue-200 dark:text-blue-200 text-blue-400 dark:bg-blue-950 dark:border-blue-900",
                              "flex items-center gap-1 text-[10px] font-semibold border shadow-sm shadow-1 rounded-md pl-2 pr-1 py-0.5",
                           )}
                        >
                           {video_link ? "Show Info/Video Link" : "Show Info"}
                           <div
                              className={clsx(
                                 open
                                    ? "TableRowansform rotate-180 text-blue-500 dark:text-blue-200 font-bold "
                                    : "dark:text-blue-300 ",
                              )}
                           >
                              <Icon size={16} name="chevron-down" />
                           </div>
                        </button>
                     </div>
                  </div>
               </div>
            </section>

            {open ? (
               <section className="pt-4 space-y-3">
                  {/* NP Main info table */}
                  <Table dense grid framed>
                     <TableRow>
                        <TableHeader>Rank</TableHeader>
                        <TableHeader>Classification</TableHeader>
                        <TableHeader>Hit Count</TableHeader>
                     </TableRow>
                     <TableRow>
                        <TableCell>{np_rank}</TableCell>
                        <TableCell>{np_classification}</TableCell>
                        <TableCell>{np_hit_count ?? "-"}</TableCell>
                     </TableRow>
                  </Table>
                  {/* Effect Table */}
                  <Table dense grid framed>
                     <TableRow>
                        <TableHeader>Effect</TableHeader>
                        <TableCell
                           colSpan={5}
                           className="border-b border-color"
                        >
                           <div
                              dangerouslySetInnerHTML={{
                                 __html: np_description
                                    .replace(/\<br\>/g, "")
                                    .replace(/\<p\>\r\n/g, "<p>"),
                              }}
                           />
                        </TableCell>
                     </TableRow>
                     <TableRow>
                        <TableHeader>Level </TableHeader>
                        <TableHeader>1 </TableHeader>
                        <TableHeader>2 </TableHeader>
                        <TableHeader>3 </TableHeader>
                        <TableHeader>4 </TableHeader>
                        <TableHeader>5 </TableHeader>
                     </TableRow>
                     {np_effect_list?.map((eff: any, ei: number) => {
                        return (
                           <TableRow key={"np_effect_list_" + ei}>
                              <TableHeader className="border-b-0 border-t">
                                 {eff?.effect_display}
                              </TableHeader>
                              {[0, 1, 2, 3, 4]?.map((i: any) => {
                                 return (
                                    <TableCell className="border-t" key={ei}>
                                       {eff.values_per_level?.[i] ?? ""}
                                    </TableCell>
                                 );
                              })}
                           </TableRow>
                        );
                     })}
                  </Table>
                  {/* Overcharge Effect Table */}
                  <Table dense grid framed bleed>
                     <TableRow>
                        <TableHeader>Overcharge Effect</TableHeader>
                        <TableCell
                           colSpan={5}
                           className="border-b border-color"
                        >
                           <div
                              className="text-sm whitespace-pre-wrap leading-tight"
                              dangerouslySetInnerHTML={{
                                 __html: np_overcharge
                                    .replace(/\<br\>/g, "")
                                    .replace(/\<p\>\r\n/g, "<p>"),
                              }}
                           ></div>
                        </TableCell>
                     </TableRow>
                     <TableRow>
                        <TableHeader>Level</TableHeader>
                        <TableHeader>1</TableHeader>
                        <TableHeader>2</TableHeader>
                        <TableHeader>3</TableHeader>
                        <TableHeader>4</TableHeader>
                        <TableHeader>5</TableHeader>
                     </TableRow>
                     {np_effect_list_overcharge?.map((eff: any, ei: number) => {
                        return (
                           <TableRow key={ei}>
                              <TableHeader
                                 className="border-b-0"
                                 key={"np_effect_list_overcharge_" + ei}
                              >
                                 {eff?.effect_display}
                              </TableHeader>

                              {[0, 1, 2, 3, 4]?.map((i: any) => {
                                 return (
                                    <>
                                       <TableCell>
                                          {eff.values_per_level?.[i] ?? ""}
                                       </TableCell>
                                    </>
                                 );
                              })}
                           </TableRow>
                        );
                     })}
                  </Table>
                  {video_link ? (
                     <iframe
                        width="100%"
                        height="380px"
                        src={`https://www.youtube.com/embed/${video_link}`}
                        title="YouTube video player"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                     ></iframe>
                  ) : null}
               </section>
            ) : null}
         </div>

         {np.np_upgrades?.map((npupg: any) => {
            return <NoblePhantasmDisplay key={npupg.id} np={npupg} />;
         })}
      </>
   );
};
