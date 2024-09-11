import type { CommandCode as CommandCodeType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

export function CommandCodesEffect({ data: cc }: { data: CommandCodeType }) {
   const dispData = [
      {
         header: "Effect",
         value: cc?.desc_effect,
         image: cc?.effect_image?.icon?.url,
      },
      {
         header: "Acquisition Method",
         value: cc?.acquisition_method,
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
      </>
   );
}
