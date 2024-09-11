import { Fragment } from "react";

import { Link } from "@remix-run/react";

import type { CommandCode as CommandCodeType } from "payload/generated-custom-types";
import { Image } from "~/components/Image";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";

export function CommandCodesSimilar({ data: cc }: { data: CommandCodeType }) {
   return (
      <div className="space-y-6">
         {cc.effect_list?.map((eff: any) => {
            const name = eff.effect?.name;
            const icon = eff.effect.icon?.url;
            const cclist = eff.effect.cc_With_Effect;
            return (
               <>
                  {cclist?.length > 0 ? (
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
                           {cclist.map((c: any) => {
                              return (
                                 <Tooltip key={c?.id} placement="top">
                                    <TooltipTrigger className="size-12 inline-block align-middle m-0.5">
                                       <Link
                                          to={`/c/command-codes/${
                                             c?.slug ?? c?.id
                                          }`}
                                       >
                                          <Image
                                             height={"auto"}
                                             width={60}
                                             className="overflow-clip text-xs"
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
