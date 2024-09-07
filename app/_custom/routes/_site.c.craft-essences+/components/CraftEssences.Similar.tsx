import { Fragment } from "react";

import { Link } from "@remix-run/react";

import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

export function CraftEssencesSimilar({ data: ce }: { data: CraftEssenceType }) {
   return (
      <div className="space-y-6">
         {ce.effect_list?.map((eff: any) => {
            const name = eff.effect?.name;
            const icon = eff.effect.icon?.url;
            const celist = eff.effect.ce_With_Effect;
            return (
               <>
                  {celist?.length > 0 ? (
                     <div key={name}>
                        <div className="bg-3-sub border border-color-sub rounded-lg shadow-sm shadow-1 mb-2 p-2 flex items-center gap-3">
                           {icon ? (
                              <Image
                                 width={48}
                                 height={48}
                                 className="object-contain size-9 rounded-md"
                                 url={icon}
                                 alt="skill_icon"
                                 loading="lazy"
                              />
                           ) : null}
                           <div className="flex-grow font-bold">
                              {/* Description */}
                              {name}
                           </div>
                        </div>
                        <div className="">
                           {celist.map((c: any) => {
                              return (
                                 <Tooltip key={c?.id} placement="top">
                                    <TooltipTrigger className="size-12 inline-block align-middle m-0.5">
                                       <Link
                                          to={`/c/craft-essences/${
                                             c?.slug ?? c?.id
                                          }`}
                                       >
                                          <Image
                                             height={60}
                                             width={60}
                                             className="size-12 rounded"
                                             url={c?.icon?.url}
                                             alt={c?.name}
                                             loading="lazy"
                                          />
                                       </Link>
                                    </TooltipTrigger>
                                    <TooltipContent>{c?.name}</TooltipContent>
                                 </Tooltip>
                              );
                           })}
                        </div>
                     </div>
                  ) : null}
               </>
            );
         })}
      </div>
   );
}
