import { gql, request as gqlRequest } from "graphql-request";
import { Image } from "~/components/Image";
import { Link } from "@remix-run/react";
import { Icon } from "~/components/Icon";
import clsx from "clsx";

import { useState } from "react";
import useSWR from "swr";

import { Loading } from "~/components/Loading";

type Props = {
   refId: String;
};

export const ServantOverviewView = ({ refId }: Props) => {
   const servantid = refId;

   if (!servantid) return null;

   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Servant(id: "${servantid}") {
               id
               name
               library_id
               cost
               hp_base
               hp_max
               hp_grail
               hp_lv120
               atk_base
               atk_max
               atk_grail
               atk_lv120
               num_hits_quick
               num_hits_arts
               num_hits_buster
               num_hits_extra
               class {
                  name
                  icon {
                     url
                  }
               }
               attribute {
                  id
                  name
               }
               deck_layout {
                  name
               }
               alignment {
                  id
                  name
               }
               icon {
                  url
               }
               image_stage_1 {
                  url
               }
               image_stage_2 {
                  url
               }
               image_stage_3 {
                  url
               }
               image_stage_4 {
                  url
               }
               star_rarity {
                  name
               }
               tags {
                  id
                  name
                  icon {
                     url
                  }
               }
               traits {
                  id
                  name
               }
               class_skills {
                  name
                  description
                  skill_image {
                     icon {
                        url
                     }
                  }
               }
               noble_phantasm_base {
                  card_type {
                     name
                     icon {
                        url
                     }
                  }
                  hit_count
               }
               slug
            }
            Costumes(where: { servant: { equals: ${servantid} } }) {
               docs {
                  id
                  name
                  icon {
                     url
                  }
               }
            }
         }
      `,
      (query: any) =>
         gqlRequest("https://grandorder.gamepress.gg:4000/api/graphql", query),
   );
   if (error) return null;
   if (isLoading) return <Loading />;

   //@ts-ignore
   const servant = data?.Servant;
   //@ts-ignore
   const costumes = data?.Costumes?.docs;

   const traitlist = servant?.traits;
   const taglist = servant?.tags;

   const classlist = servant?.class_skills;

   return (
      <div contentEditable={false} className="">
         <a href={`/c/servants/${servant.id}`}>
            <div className="flex border border-color-sub shadow-1 shadow-color px-3 py-1 my-1 rounded-md bg-2-sub justify-between font-bold items-center">
               <div className="text-blue-400">{servant.name}</div>
            </div>
         </a>

         <div>
            <ServantImageBaseData charData={servant} costumeData={costumes} />
            {traitlist && traitlist?.length > 0 ? (
               <>
                  <h3 className="flex items-center dark:text-zinc-100 max-laptop:mt-3 mt-1 gap-3 mb-1.5 font-header text-lg">
                     <div className="min-w-[10px] flex-none">Traits</div>
                     <div className="h-1 flex-grow rounded-full bg-zinc-100 dark:bg-dark400" />
                  </h3>
                  {traitlist.map((trait: any, tkey: number) => (
                     <Link
                        to={`/c/traits/${trait.id}`}
                        key={"trait_list_" + tkey}
                     >
                        <div
                           className="inline-flex text-sm font-semibold bg-2-sub gap-1 mr-2 rounded-lg px-2.5 py-1.5 mb-2 
                           border-color-sub border shadow-sm shadow-1 hover:underline"
                        >
                           {trait.name}
                        </div>
                     </Link>
                  ))}
               </>
            ) : null}
            {taglist && taglist.length > 0 ? (
               <>
                  <h3 className="flex items-center dark:text-zinc-100 gap-3 mb-1.5 font-header text-lg">
                     <div className="min-w-[10px] flex-none">Tags</div>
                     <div className="h-1 flex-grow rounded-full bg-zinc-100 dark:bg-dark400" />
                  </h3>
                  {taglist.map((tag: any, tkey: number) => (
                     <Link to={`/c/tags/${tag.id}`} key={"tag_list_" + tkey}>
                        <div className="inline-block bg-2-sub gap-1 mr-2 pr-2.5 rounded-md p-1.5 mb-2 border-color-sub border shadow-sm shadow-1">
                           {/* Show tag icon if applicable */}
                           {tag.icon ? (
                              <div className="inline-block h-5 w-5 relative align-middle mr-1">
                                 <Image
                                    alt="Tag Icon"
                                    className="object-contain w-full h-full"
                                    url={tag.icon?.url}
                                    loading="lazy"
                                 />
                              </div>
                           ) : null}
                           <span className="align-middle text-sm font-semibold hover:underline">
                              {tag.name}
                           </span>
                        </div>
                     </Link>
                  ))}
               </>
            ) : null}

            <h3 className="mb-1.5">Class Skills</h3>
            {classlist?.map((skill: any, ci: number) => {
               return (
                  <ClassSkillDisplay
                     skill={skill}
                     key={"class_skill_display_" + ci}
                  />
               );
            })}
         </div>
      </div>
   );
};

function ServantImageBaseData({
   charData,
   costumeData,
}: {
   charData: any;
   costumeData: any;
}) {
   // Initialize list of selectable images for a Servant (4 stages by default; additional images can be appended to this object for costumes)
   let selectimg = [
      {
         name: "Stage 1",
         url: charData?.image_stage_1?.url,
      },
      {
         name: "Stage 2",
         url: charData.image_stage_2?.url,
      },
      {
         name: "Stage 3",
         url: charData.image_stage_3?.url,
      },
      {
         name: "Stage 4",
         url: charData.image_stage_4?.url,
      },
   ];
   const costumeimg = costumeData?.map((cost: any) => {
      return {
         name: cost.name,
         url: cost.icon?.url,
      };
   });
   // console.log(costumeimg);
   selectimg.push(...costumeimg);

   // UseState variable to track selected display image for Servant
   const [characterImage, setCharacterImage] = useState(selectimg[0]?.name);

   // Get deck list array
   // ----------------
   const cc_q = "https://static.mana.wiki/grandorder/FGOCommandCard_Quick.png";
   const cc_b = "https://static.mana.wiki/grandorder/FGOCommandCard_Buster.png";
   const cc_a = "https://static.mana.wiki/grandorder/FGOCommandCard_Arts.png";
   const decklist = charData?.deck_layout?.name
      //@ts-ignore
      ?.slice(0, 5)
      .split("")
      .map((card: any) => {
         switch (card) {
            case "Q":
               return cc_q;

            case "A":
               return cc_a;

            case "B":
               return cc_b;

            default:
               return undefined;
         }
      });

   // Get list of hitcounts per card type
   // Q - A - B - E - NP
   const hitcounts = [
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Quick.png",
         hits: charData?.num_hits_quick,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Arts.png",
         hits: charData?.num_hits_arts,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Buster.png",
         hits: charData?.num_hits_buster,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Extra.png",
         hits: charData?.num_hits_extra,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOInterludeReward_NPUpgrade.png",
         hits: charData?.noble_phantasm_base?.hit_count,
      },
   ];
   const nptype = charData?.noble_phantasm_base?.card_type?.icon?.url;

   // Attribute and Alignment
   const attribute = charData?.attribute?.name;
   const attributeid = charData?.attribute?.id;
   const alignment = charData?.alignment?.name;
   const id = charData?.library_id;

   const imgUrl = selectimg.find((a) => a.name == characterImage)?.url;

   const classicon = charData?.class?.icon?.url;
   const classname = charData?.class?.name;
   const rarityno = charData?.star_rarity?.name;

   return (
      <>
         {/* Header - Class and Rarity */}
         <div className="flex items-center shadow-sm shadow-1 border border-color-sub py-2 pl-2 pr-3 rounded-lg bg-2-sub mb-2">
            <div className="flex-grow font-bold">
               <div className="relative inline-block align-middle size-7">
                  <Image width={40} height={40} url={classicon} />
               </div>
               <div className="relative inline-block align-middle font-bold ml-2 w-2/5">
                  {classname}
               </div>
            </div>
            <div className="flex-none">
               <StarRarity key={id} rar={rarityno} />
            </div>
         </div>
         <div className="tablet:flex max-tablet:flex-col items-start gap-3 pb-4">
            <section className="space-y-0.5 max-tablet:pb-3 tablet:max-w-[340px]">
               {/* Servant Image */}
               <Link to={imgUrl ?? ""} className="relative block">
                  <div className="tablet:w-[295px] min-h-[250px]">
                     <Image
                        width={680}
                        className="rounded-md max-laptop:w-full"
                        url={imgUrl ?? ""}
                        alt={charData?.name ?? "Servant Image"}
                     />
                  </div>
                  <div className="absolute text-black top-2 right-2 backdrop-blur-md bg-white/50 font-header rounded-lg font-bold px-2 py-1 flex items-baseline gap-0.5">
                     <span className="text-xs text-zinc-700"># </span>
                     <span>{id}</span>
                  </div>
                  <div className="flex flex-col gap-0.5 absolute top-2 left-2 backdrop-blur-md bg-white/30 rounded">
                     {decklist?.map((card: any, int: number) => (
                        <div className="size-10" key={int}>
                           <Image
                              height={80}
                              width={80}
                              url={card}
                              loading="lazy"
                           />
                        </div>
                     ))}
                  </div>
               </Link>
            </section>
            {/* Right Data Block */}
            <div className="flex-grow space-y-3">
               {/* - Hit count */}
               <div className="flex items-center justify-evenly shadow-sm shadow-1 border border-color-sub py-2 rounded-lg bg-2-sub">
                  {hitcounts.map((hit: any, i: any) => (
                     <div key={i} className="relative">
                        <div className="flex items-center align-middle gap-2">
                           <div className="h-auto w-8">
                              <Image
                                 height={64}
                                 url={hit.img}
                                 alt="CardType"
                                 loading="lazy"
                              />
                           </div>
                           {/* Show NP Card type if NP row */}
                           {i == 4 ? (
                              <div className="h-auto w-8 inline-block">
                                 <Image
                                    height={64}
                                    url={nptype}
                                    alt="NP"
                                    loading="lazy"
                                 />
                              </div>
                           ) : null}
                           <div className="text-xs font-bold rounded-full dark:bg-dark500 size-4 flex items-center justify-center absolute -right-4 bottom-[8px]">
                              {hit.hits ?? "-"}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
               <div
                  className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
               mb-3 overflow-hidden bg-2-sub"
               >
                  <div className="px-2.5 py-2 justify-between flex items-center gap-2 text-xs">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold">Attribute</span>
                     </div>
                     <div className="font-semibold text-1 text-right">
                        <Link
                           to={`/c/attributes/${attributeid}`}
                           className="text-blue-500 hover:underline"
                        >
                           {attribute}
                        </Link>
                     </div>
                  </div>
                  <div className="px-2.5 py-2 justify-between flex items-center gap-2 text-xs">
                     <div className="flex items-center gap-2">
                        <span className="font-semibold">Alignments</span>
                     </div>
                     <div className="font-semibold text-1 text-right">
                        {alignment}
                     </div>
                  </div>
               </div>
               <TableHPATK data={charData} />
               {/* - Image Selection */}
               <div className="grid grid-cols-2 laptop:grid-cols-2 gap-2 py-2">
                  {selectimg.map((opt: any) => (
                     <button
                        className={clsx(
                           characterImage == opt.name
                              ? "bg-blue-100 dark:text-blue-200 text-blue-500 border-blue-300 dark:border-blue-800 dark:bg-blue-950"
                              : " dark:border-zinc-600 dark:bg-dark400",
                           "border border-color shadow-sm shadow-1 rounded-md text-xs font-bold py-1.5 px-2 text-center",
                        )}
                        onClick={() => setCharacterImage(opt.name)}
                        key={opt.name}
                     >
                        {opt.name}
                     </button>
                  ))}
               </div>
            </div>
         </div>
      </>
   );
}

// =====================================
// For rendering Rarity Stars
// =====================================

export function StarRarity({ rar }: { rar: any }) {
   let color = ["text-yellow-500"];
   switch (rar) {
      case "0":
         color = ["text-black"];
         break;
      case "1":
         color = ["text-yellow-800"];
         break;
      case "2":
         color = ["text-yellow-800", "text-yellow-800"];
         break;
      case "3":
         color = ["text-gray-400", "text-gray-400", "text-gray-400"];
         break;
      case "4":
         color = [
            "text-yellow-600",
            "text-yellow-600",
            "text-yellow-600",
            "text-yellow-600",
         ];
         break;
      case "5":
         color = [
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
            "text-yellow-500",
         ];
         break;
      default:
   }
   return (
      <div className="flex items-center gap-1">
         {color.map((a, i) => (
            <FaStar key={i} className={` ${a} size-4 inline-block relative`} />
         ))}
      </div>
   );
}

// =====================================
// For rendering Icons
// =====================================

const FaStar = (props: any) => (
   <svg
      className={props.className}
      height={props.h}
      width={props.w}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 576 512"
   >
      <path
         fill="currentColor"
         d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"
      />
   </svg>
);

function TableHPATK({ data: servant }: { data: any }) {
   const baseatk = servant?.atk_base;
   const basehp = servant?.hp_base;
   const maxatk = servant?.atk_max;
   const maxhp = servant?.hp_max;
   const lv100atk = servant?.atk_grail;
   const lv100hp = servant?.hp_grail;
   const lv120atk = servant?.atk_lv120;
   const lv120hp = servant?.hp_lv120;

   return (
      <>
         <div className="space-y-3">
            <div className="bg-2-sub shadow-sm shadow-1 border border-color-sub rounded-lg py-2 px-3">
               <div className="font-bold text-sm flex items-center gap-2 pb-1">
                  <span className="font-mono text-base">Attack</span>
                  <span className="flex-grow h-0.5 rounded-full dark:bg-dark450 bg-zinc-100" />
               </div>
               <div className="text-sm flex items-center justify-evenly gap-3">
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Base</span>
                     <span className="font-semibold">
                        {baseatk?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Max</span>
                     <span className="font-semibold text-yellow-500">
                        {maxatk?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Lv 100</span>
                     <span className="font-semibold">
                        {lv100atk?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Lv 120</span>
                     <span className="font-semibold">
                        {lv120atk?.toLocaleString()}
                     </span>
                  </div>
               </div>
            </div>
            <div className="bg-2-sub shadow-sm shadow-1 border border-color-sub rounded-lg py-2 px-3">
               <div className="font-bold text-sm flex items-center gap-2 pb-1">
                  <span className="font-mono text-base">HP</span>
                  <span className="flex-grow h-0.5 rounded-full dark:bg-dark450 bg-zinc-100" />
               </div>
               <div className="text-sm flex items-center justify-evenly gap-3">
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Base</span>
                     <span className="font-semibold">
                        {basehp?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Max</span>
                     <span className="font-semibold text-yellow-500">
                        {maxhp?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Lv 100</span>
                     <span className="font-semibold">
                        {lv100hp?.toLocaleString()}
                     </span>
                  </div>
                  <Icon
                     size={14}
                     name="arrow-right"
                     className="text-1 mx-auto"
                  />
                  <div className="flex items-start flex-col gap-1">
                     <span className="text-1 text-xs">Lv 120</span>
                     <span className="font-semibold">
                        {lv120hp?.toLocaleString()}
                     </span>
                  </div>
               </div>
            </div>
         </div>
      </>
   );
}

const ClassSkillDisplay = ({ skill }: any) => {
   const skill_name = skill?.name;
   const skill_icon = skill?.skill_image?.icon?.url;
   const skill_description = skill?.description;

   return (
      <>
         <div className="p-3 border border-color-sub rounded-lg mb-3 shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
            <div className="flex items-start gap-3">
               <Image
                  className="size-10 flex-none mt-0.5"
                  height={80}
                  url={skill_icon}
                  alt="SkillIcon"
                  loading="lazy"
               />
               <div className="flex-grow">
                  <div className="font-bold text-base pb-0.5">{skill_name}</div>
                  <div
                     className="text-sm whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{
                        __html: skill_description
                           ? skill_description
                                .replace(/\<br\>/g, "")
                                .replace(/\<p\>\r\n/g, "<p>")
                           : null,
                     }}
                  ></div>
               </div>
            </div>
         </div>
      </>
   );
};