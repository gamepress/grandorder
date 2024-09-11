import { useState } from "react";

import { Link } from "@remix-run/react";
import clsx from "clsx";

import { Badge } from "~/components/Badge";
import { H2Plain } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { EditorSection } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/EditorSection";
import type { SubSectionType } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Section";

const tablestyling = `
   <style>
   table.skill-table tr th {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
     background-color: rgba(50,50,50,0.03);
   }
   .dark table.skill-table tr th {
      border-color: rgba(250,250,250,0.1);
      background-color: rgba(250,250,250,0.03);
   }
   table.skill-table tr td {
     text-align:center;
     padding: 0.2rem;
     font-size: 0.7rem;
     border-width: 1px;
   }
   .dark table.skill-table tr td {
     border-color: rgba(250,250,250,0.1);
   }
   </style>
   `;

export function LevelUpSkillRec({
   data,
   subSection,
}: {
   data: any;
   subSection: SubSectionType;
}) {
   const skillLevels = data?.servant?.writeup_skill_level_recommendation;

   return skillLevels && skillLevels.length > 0 ? (
      <>
         <H2Plain text="Level Up Skill Recommendations" />
         <div className="pb-3 space-y-3">
            {skillLevels?.map((skill: any, si: any) => {
               return (
                  <SkillDisplay
                     skill={skill}
                     key={"skill_recommendation_display_" + si}
                  />
               );
            })}
         </div>
         <EditorSection subSection={subSection} />
      </>
   ) : null;
}

export function CERec({
   data,
   subSection,
}: {
   data: any;
   subSection: SubSectionType;
}) {
   const celist = data?.servant?.recommended_ces;
   return (
      <>
         {celist && celist.length > 0 ? (
            <>
               <H2Plain text="🖼️ Craft Essence Recommendations" />
               <div className="grid grid-cols-2 gap-2 pb-3">
                  {celist?.map((bc: any) => {
                     return (
                        <Link
                           key={bc.id}
                           className="flex items-center gap-3 bg-2-sub p-2 rounded-lg shadow-sm shadow-1 border border-color-sub"
                           to={`/c/craft-essences/${bc?.slug ?? bc.id}`}
                        >
                           <Image
                              url={bc?.icon?.url ?? "no_image_42df124128"}
                              width={80}
                              height={80}
                              className="size-9 rounded-md"
                              alt={bc?.name}
                              loading="lazy"
                           />
                           <span className="font-bold text-sm">{bc?.name}</span>
                        </Link>
                     );
                  })}
               </div>
               <EditorSection subSection={subSection} />
            </>
         ) : null}
      </>
   );
}

const SkillDisplay = ({ skill }: any) => {
   const skilldat = skill.level_up_skill;
   const skillrec = skill.level_up_importance?.name;
   const skill_name = skilldat?.name;
   const skill_icon = skilldat?._skill_Image?.icon?.url;
   const skill_value_table = skilldat?.effect_value_table;
   const skill_description = skilldat?.description;
   const cd = skilldat.cooldown ?? 0;

   const skilltablehtml = `
   ${tablestyling}
   <tr>
   <th>Lvl</th>
   <th>1</th>
   <th>2</th>
   <th>3</th>
   <th>4</th>
   <th>5</th>
   <th>6</th>
   <th>7</th>
   <th>8</th>
   <th>9</th>
   <th>10</th>
   </tr>
   ${skill_value_table}
   <tr>
     <th>CD</th>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 1}</td>
     <td>${cd - 2}</td>
   </tr>`;
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="rounded-lg p-3 bg-2-sub border border-color-sub shadow-1 shadow-sm">
            <div className="flex items-start gap-3">
               <div className="flex flex-col items-center gap-2">
                  <SkillRecCircle rec={skillrec} />
                  <Image
                     height={80}
                     width={80}
                     url={skill_icon}
                     className="size-10 flex-none"
                     alt="SkillIcon"
                  />
               </div>
               <div className="flex-grow">
                  <div className="font-bold">{skill_name}</div>
                  <div
                     className="text-xs whitespace-pre-wrap pt-0.5 pb-2"
                     dangerouslySetInnerHTML={{
                        __html: skill_description
                           .replace(/\<br\>/g, "")
                           .replace(/\<p\>\r\n/g, "<p>"),
                     }}
                  ></div>
                  <button
                     onClick={() => setOpen(!open)}
                     className={clsx(
                        open
                           ? "bg-blue-100 text-blue-600 border-blue-300 dark:text-blue-200 dark:bg-blue-900 dark:border-blue-800"
                           : "bg-blue-50 border-blue-200 dark:text-blue-200 text-blue-400 dark:bg-blue-950 dark:border-blue-900",
                        "flex items-center justify-between gap-1 text-[10px] border rounded-md pl-2 pr-1 w-full py-1 font-bold",
                     )}
                  >
                     <div>Show Info</div>
                     <Icon
                        className={clsx(
                           open
                              ? "transform rotate-180 text-blue-500 dark:text-blue-200"
                              : "dark:text-blue-300 ",
                        )}
                        size={16}
                        name="chevron-down"
                     />
                  </button>
               </div>
            </div>
            {open ? (
               <div className="overflow-auto">
                  <table
                     className="text-xs text-center mt-3 w-full skill-table overflow-auto"
                     dangerouslySetInnerHTML={{ __html: skilltablehtml }}
                  ></table>
               </div>
            ) : null}
         </div>
      </>
   );
};
const SkillRecCircle = ({ rec }: any) => {
   switch (rec) {
      case "Higher":
         return (
            <Badge className="justify-center w-full" color="teal">
               Higher
            </Badge>
         );
      case "High":
         return (
            <Badge className="justify-center w-full" color="green">
               High
            </Badge>
         );
      case "Medium":
         return (
            <Badge className="justify-center w-full" color="lime">
               Med
            </Badge>
         );
      case "Low":
         return (
            <Badge className="justify-center w-full" color="orange">
               Low
            </Badge>
         );
      case "Lower":
         return (
            <Badge className="justify-center w-full" color="red">
               Lower
            </Badge>
         );
      default:
         return null;
   }
};
