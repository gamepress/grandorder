import { Link } from "@remix-run/react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2Plain } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function Profile({ data }: { data: any }) {
   const servant = data.servant;
   const ce = data.ceData;
   return (
      <>
         <TableInfo data={servant} />
         <Parameters data={servant} />
         <ValentinesCE ce={ce} />
         <ProfileEntries data={servant} />
         <VoiceLines data={servant} />
      </>
   );
}

function TableInfo({ data: servant }: { data: ServantType }) {
   const info = [
      {
         name: "Illustrator",
         value: servant?.illustrator?.name,
         url: "/c/illustrators/" + servant?.illustrator?.id,
      },
      {
         name: "Seiyuu (CV)",
         value: servant?.cv?.name,
         url: "/c/cvs/" + servant?.cv?.id,
      },
      {
         name: "AKA/Alias/Nicknames",
         value: servant?.aka_aliases_nicknames,
      },
      {
         name: "Country/Place of Origin",
         value: servant?.country_origin,
      },
      {
         name: "Series",
         value: servant?.series,
      },
      {
         name: "Release Date (JP)",
         value: servant?.jp_release_date,
      },
      {
         name: "Release Date (NA)",
         value: servant?.np_release_date,
      },
   ];

   return (
      <Table dense grid framed>
         <TableBody>
            {info?.map((irow: any, ind: any) => {
               return (
                  <>
                     {irow?.value ? (
                        <>
                           <TableRow key={"additional_info_" + ind}>
                              <TableHeader
                                 className="border-b-0"
                                 key={"info_row_" + ind}
                              >
                                 {irow?.name}
                              </TableHeader>
                              <TableCell key={"info_value_" + ind}>
                                 {irow?.url ? (
                                    <Link
                                       to={`${irow?.url}`}
                                       className="text-blue-500 hover:underline"
                                    >
                                       {irow.value}
                                    </Link>
                                 ) : (
                                    irow.value
                                 )}
                              </TableCell>
                           </TableRow>
                        </>
                     ) : null}
                  </>
               );
            })}
         </TableBody>
      </Table>
   );
}

function Parameters({ data: servant }: { data: ServantType }) {
   // STR / END
   // AGL / MP
   // LUK / NP

   const paramlist = [
      {
         name: "STR",
         grade: servant.str_grade,
         bar: servant.str_bar,
      },
      {
         name: "END",
         grade: servant.end_grade,
         bar: servant.end_bar,
      },
      {
         name: "AGL",
         grade: servant.agl_grade,
         bar: servant.agl_bar,
      },
      {
         name: "MP",
         grade: servant.mp_grade,
         bar: servant.mp_bar,
      },
      {
         name: "LUK",
         grade: servant.luk_grade,
         bar: servant.luk_bar,
      },
      {
         name: "NP",
         grade: servant.np_grade,
         bar: servant.np_bar,
      },
   ];

   return (
      <>
         <H2Plain text="Parameters" />
         <div className="grid grid-cols-2 text-sm justify-center gap-x-6 gap-y-2 bg-2-sub shadow-1 shadow-sm rounded-lg p-3 py-4 border border-color-sub">
            {paramlist?.map((p: any) => {
               return (
                  <>
                     <div className="w-full flex justify-left gap-2">
                        <div className="flex-none w-7 font-mono font-bold">
                           {p.name}
                        </div>
                        <div className="flex-grow">
                           {[1, 2, 3, 4, 5].map((bar: any) => {
                              return (
                                 <div
                                    key={bar}
                                    className={`inline-block h-5 w-1/5 border border-color-sub
                                    ${
                                       bar <= p.bar && p.bar != 6
                                          ? " bg-orange-400"
                                          : null
                                    }
                                    ${
                                       p.bar == 6
                                          ? " bg-yellow-300 bg-opacity-80"
                                          : null
                                    }
                                    ${bar == 1 ? " rounded-l-lg" : null}
                                    ${bar == 5 ? " rounded-r-lg" : null}`}
                                 ></div>
                              );
                           })}
                        </div>
                        <div className="w-8 ml-1 font-bold">{p.grade}</div>
                     </div>
                  </>
               );
            })}
         </div>
      </>
   );
}

function ValentinesCE({ ce }: { ce: any }) {
   const val_ce = ce?.filter((a: any) => a.is_valentines == true);
   return (
      <>
         {val_ce && val_ce.length > 0 ? (
            <>
               <H2Plain text="Valentine's CE" />
               {val_ce?.map((bc: any) => {
                  return (
                     <>
                        <Link
                           className="bg-2-sub shadow-1 shadow-sm rounded-xl flex items-center gap-3 p-2.5 border border-color-sub mb-2"
                           to={`/c/craft-essences/${bc?.id}`}
                        >
                           <Image
                              className="size-12 rounded-lg border border-color-sub shadow-1 shadow-sm"
                              url={bc?.icon?.url ?? "no_image_42df124128"}
                              alt={bc?.name}
                              loading="lazy"
                           />
                           <div className="text-blue-500 font-bold">
                              {bc?.name}
                           </div>
                        </Link>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
}

function ProfileEntries({ data: servant }: { data: ServantType }) {
   const profiles = servant.profile_entries;

   return (
      <>
         {profiles && profiles.length > 0 ? (
            <>
               <H2Plain text="Profile Entries" />
               {profiles.map((pe: any) => {
                  return (
                     <>
                        <h3 className="pb-1 pt-3.5 mb-2.5 border-b-2 border-color-sub text-lg">
                           {pe?.title}
                        </h3>
                        <div
                           className="whitespace-pre-wrap"
                           dangerouslySetInnerHTML={{ __html: pe.text }}
                        ></div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
}

function VoiceLines({ data: servant }: { data: ServantType }) {
   const lines = servant.voice_lines;

   return (
      <>
         {lines && lines?.length > 0 ? (
            <>
               <H2Plain text="Voice Lines" />
               <Table grid framed dense>
                  <TableBody>
                     {lines?.map((irow: any, ind: any) => {
                        return (
                           <>
                              {irow?.text ? (
                                 <>
                                    <TableRow key={"voice_lines_row_" + ind}>
                                       <TableHeader key={"info_row_" + ind}>
                                          {irow?.title}
                                       </TableHeader>
                                       <TableCell>
                                          <div
                                             key={"info_value_" + ind}
                                             dangerouslySetInnerHTML={{
                                                __html: irow?.text,
                                             }}
                                          />
                                       </TableCell>
                                    </TableRow>
                                 </>
                              ) : null}
                           </>
                        );
                     })}
                  </TableBody>
               </Table>
            </>
         ) : null}
      </>
   );
}
