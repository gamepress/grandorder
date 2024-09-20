import type { Enemy as EnemyType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";

export function EnemiesMain({ data: enemy }: { data: Enemy }) {
   return (
      <>
         <div className="tablet:flex items-center gap-3 border border-color-sub rounded-md p-3">
            <div className="">
               <Image
                  width={50}
                  className="rounded-md "
                  url={enemy?.icon?.url}
                  alt={"Icon"}
               />
            </div>
            <div className="text-lg">{enemy?.name}</div>
            <div>
               <Image
                  width={30}
                  className="rounded-md "
                  url={enemy.class_rarity?.icon?.url}
                  alt={"Icon enemy.class_rarity?.name"}
               />
            </div>
         </div>
         <TraitList enemy={enemy} />
         <Skills enemy={enemy} />
      </>
   );
}

const TraitList = ({ enemy }: any) => {
   const traitlist = enemy.traits;
   return (
      <>
         {traitlist && traitlist?.length > 0 ? (
            <>
               <h3 className="flex items-center dark:text-zinc-100 mt-3 gap-3 pb-1.5 font-header text-lg">
                  <div className="min-w-[10px] flex-none">Traits</div>
                  <div className="h-1 flex-grow rounded-full bg-zinc-100 dark:bg-dark400" />
               </h3>
               {traitlist.map((trait: any, tkey) => {
                  return (
                     <>
                        <div
                           className="inline-flex text-sm font-semibold bg-2-sub gap-1 mr-2 rounded-lg px-2.5 py-1.5 mb-2 
                           border-color-sub border shadow-sm shadow-1"
                           key={"trait_list_" + tkey}
                        >
                           {trait.name}
                        </div>
                     </>
                  );
               })}
            </>
         ) : null}
      </>
   );
};

const Skills = ({ enemy }: any) => {
   const desc_skill = enemy.desc_skills;
   const desc_np = enemy.desc_np;

   return (
      <>
         {desc_skill ? (
            <>
               <h3 className="flex items-center dark:text-zinc-100 mt-3 gap-3 pb-1.5 font-header text-lg">
                  <div className="min-w-[10px] flex-none">Skills</div>
                  <div className="h-1 flex-grow rounded-full bg-zinc-100 dark:bg-dark400" />
               </h3>
               <div
                  className="bg-2-sub border-color-sub border px-2.5 py-1.5 rounded-md"
                  dangerouslySetInnerHTML={{ __html: desc_skill }}
               ></div>
            </>
         ) : null}
         {desc_np ? (
            <>
               <h3 className="flex items-center dark:text-zinc-100 mt-3 gap-3 pb-1.5 font-header text-lg">
                  <div className="min-w-[10px] flex-none">NP</div>
                  <div className="h-1 flex-grow rounded-full bg-zinc-100 dark:bg-dark400" />
               </h3>
               <div
                  className="bg-2-sub border-color-sub border px-2.5 py-1.5 rounded-md"
                  dangerouslySetInnerHTML={{ __html: desc_np }}
               ></div>
            </>
         ) : null}
      </>
   );
};

const MaterialFrame = ({ materialqty }: any) => {
   const mat = materialqty?.material;
   const qty = materialqty?.qty;

   return (
      <>
         <div
            className="relative inline-block text-center mr-0.5 mb-1"
            key={mat?.id}
         >
            <a href={`/c/materials/${mat?.id}`}>
               <div className="relative inline-block h-12 w-12 align-middle text-xs">
                  <img
                     src={mat?.icon?.url ?? "no_image_42df124128"}
                     className={`object-contain h-12`}
                     alt={mat?.name}
                     loading="lazy"
                  />
               </div>
               {qty ? (
                  <div className="absolute z-10 -bottom-0.5 right-2 text-sm text-white grandorder-material-qty">
                     {qty}
                  </div>
               ) : null}
            </a>
         </div>
      </>
   );
};
