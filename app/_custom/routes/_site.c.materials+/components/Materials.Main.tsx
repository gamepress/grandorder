import { Image } from "~/components/Image";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import { Link } from "@remix-run/react";

export function MaterialsMain({ data }: { data: any }) {
   const material = data?.entry?.data?.Material;
   const icon = material?.icon?.url;
   const desc = material?.description;
   const bonusces = material?.ce_With_Drop_Bonus;

   return (
      <>
         <div className="bg-2-sub border border-color-sub shadow-sm shadow-1 rounded-lg p-4 flex items-center flex-col justify-center">
            <Image
               height={100}
               className="h-20 w-auto mx-auto"
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

         {/* If CEs give bonus for this item */}
         {bonusces?.length > 0 ? (
            <>
               <SectionTitle customTitle={"Drop Bonus Craft Essences"} />
               <div className="flex items-center gap-1">
                  {bonusces.map((ce) => (
                     <CEDisplay ce={ce} />
                  ))}
               </div>
            </>
         ) : null}
      </>
   );
}

const CEDisplay = ({ ce }: any) => {
   const name = ce.name;
   const frame = ce._rarity?.icon_frame?.url;
   const icon = ce.icon?.url;

   return (
      <>
         <Tooltip key={ce?.id} placement="top">
            <TooltipTrigger className="size-12 inline-block align-middle relative">
               <Link to={`/c/craft-essences/${ce?.slug ?? ce?.id}`}>
                  <Image
                     width={80}
                     alt={name}
                     url={frame}
                     className="object-contain w-12 z-10 relative"
                     loading="lazy"
                  />
                  <Image
                     width={80}
                     alt={name}
                     url={icon}
                     className="object-contain w-12 rounded-t-md absolute top-[1px] left-0"
                     loading="lazy"
                  />
               </Link>
            </TooltipTrigger>
            <TooltipContent>{name}</TooltipContent>
         </Tooltip>
      </>
   );
};
