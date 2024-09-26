import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

export function CraftEssencesEffect({ data: ce }: { data: CraftEssenceType }) {
   const dispData = [
      {
         header: "Effect",
         value: ce?.description,
         image: ce?._ce_Type_Image?.icon?.url,
      },
      {
         header: "Limit Break",
         value: ce?.description_limit_break,
         image: ce?._ce_Type_Image?.icon?.url,
      },
      {
         header: "Craft Essence Detail",
         value: ce?.description_flavor,
      },
   ];

   const mainStatDisplay = [
      {
         label: "Illustrator",
         value: ce.illustrator?.name,
         url: "/c/illustrators/" + ce.illustrator?.id,
      },
      {
         label: "CV",
         value: ce.cv?.name,
         url: "/c/cvs/" + ce?.cv?.id,
      },
   ];

   return (
      <>
         {dispData.map((data) => {
            return (
               <>
                  <SectionTitle customTitle={data.header} />
                  {data?.value && (
                     <div className="flex items-start gap-4 border border-color-sub rounded-lg shadow-1 shadow-sm bg-2-sub p-3">
                        {data.image ? (
                           <Image
                              width={128}
                              height={128}
                              //@ts-ignore
                              url={data?.image}
                              alt="skill_icon"
                              loading="lazy"
                              className="size-12 flex-none"
                           />
                        ) : null}
                        <div className="flex-grow">
                           {/* Description */}
                           <div
                              className="text-sm whitespace-pre-wrap"
                              dangerouslySetInnerHTML={{
                                 __html: data.value ?? "",
                              }}
                           ></div>
                        </div>
                     </div>
                  )}
               </>
            );
         })}
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
         mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden mt-3"
         >
            {mainStatDisplay?.map((row) => (
               <>
                  {row.value ? (
                     <>
                        <div className="p-3 justify-between flex items-center gap-2">
                           <div className="flex items-center gap-2">
                              <span className="font-semibold text-sm">
                                 {row.label}
                              </span>
                           </div>
                           <div className="text-sm font-semibold">
                              {row?.url ? (
                                 <Link
                                    to={`${row?.url}`}
                                    className="text-blue-500 hover:underline"
                                 >
                                    {row.value}
                                 </Link>
                              ) : (
                                 row.value
                              )}
                           </div>
                        </div>
                     </>
                  ) : null}
               </>
            ))}
         </div>
      </>
   );
}
