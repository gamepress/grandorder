import { Image } from "~/components/Image";

export function MaterialsMain({ data }: { data: any }) {
   const material = data?.entry?.data?.Material;
   const icon = material?.icon?.url;
   const desc = material?.description;

   return (
      <>
         <div className="bg-2-sub border border-color-sub shadow-sm shadow-1 rounded-lg p-4 flex items-center flex-col justify-center">
            <Image
               height={100}
               className="size-20 mx-auto"
               url={icon}
               alt="material_icon"
               loading="lazy"
            />
            {desc && (
               <div
                  className="whitespace-pre-wrap pt-3 text-center text-sm"
                  dangerouslySetInnerHTML={{ __html: desc }}
               />
            )}
         </div>
      </>
   );
}
