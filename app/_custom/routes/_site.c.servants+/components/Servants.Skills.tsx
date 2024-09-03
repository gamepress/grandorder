import { useState } from "react";

import clsx from "clsx";

import { H2Plain } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

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

export function Skills({ data }: { data: any }) {
   const servant = data.servant;
   const skilllist = servant?.skills;
   const classlist = servant?.class_skills;
   const appendlist = servant?.append_skills;
   const classunlock = servant?.class_skill_unlock;

   return (
      <>
         <div>
            {skilllist?.length > 0 ? (
               <SectionTitle customTitle="Skills" />
            ) : null}
            {skilllist?.map((skill: any, si: number) => {
               return (
                  <SkillDisplay skill={skill} key={"skill_display_" + si} />
               );
            })}

            <H2Plain text="Append Skills" />
            {appendlist?.map((skill: any, ai: number) => {
               return (
                  <AppendSkillDisplay
                     skill={skill}
                     key={"append_display_" + ai}
                  />
               );
            })}

            <H2Plain text="Class Skills" />
            {classlist?.map((skill: any, ci: number) => {
               return (
                  <ClassSkillDisplay
                     skill={skill}
                     key={"class_skill_display_" + ci}
                  />
               );
            })}

            {classunlock ? (
               <>
                  <h3>Class Skill Unlock Conditions</h3>
                  <div dangerouslySetInnerHTML={{ __html: classunlock }}></div>
               </>
            ) : null}
         </div>
      </>
   );
}

// =====================================
// 1) Skill Display Component
// =====================================
const SkillDisplay = ({ skill }: any) => {
   const skilldat = skill.skill;
   const unlock = skill.unlock;
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
         <div className="p-3 border border-color-sub rounded-lg mb-3 shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
            <div className="flex items-start gap-3">
               <div className="size-10 flex-none">
                  <Image height={80} url={skill_icon} alt="SkillIcon" />
               </div>
               <div className="flex-grow">
                  <div className="flex items-start justify-between">
                     <div className="font-bold text-sm">{skill_name}</div>
                     <button
                        onClick={() => setOpen(!open)}
                        className={clsx(
                           open
                              ? "bg-blue-100 text-blue-600 border-blue-300 dark:text-blue-200 dark:bg-blue-900 dark:border-blue-800"
                              : "bg-blue-50 border-blue-200 dark:text-blue-200 text-blue-400 dark:bg-blue-950 dark:border-blue-900",
                           "flex items-center gap-1 text-[10px] font-semibold border shadow-sm shadow-1 rounded-md pl-2 pr-1 py-0.5",
                        )}
                     >
                        <span>Show Info</span>
                        <div
                           className={clsx(
                              open
                                 ? "transform rotate-180 text-blue-500 dark:text-blue-200 font-bold "
                                 : "dark:text-blue-300 ",
                           )}
                        >
                           <Icon size={16} name="chevron-down" />
                        </div>
                     </button>
                  </div>
                  <div
                     className="text-xs whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{
                        __html: skill_description
                           .replace(/\<br\>/g, "")
                           .replace(/\<p\>\r\n/g, "<p>"),
                     }}
                  ></div>
                  <div
                     className="text-xs text-1 mt-2 italic"
                     dangerouslySetInnerHTML={{ __html: unlock }}
                  />
               </div>
            </div>
            {open ? (
               <table
                  className="text-xs text-center mt-3 w-full skill-table"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
               ></table>
            ) : null}
            {skill.upgrades
               ? skill.upgrades.map((upg: any) => (
                    <SkillUpgrade key={upg.id} skill={upg} />
                 ))
               : null}
         </div>
      </>
   );
};

// =====================================
// 2) Skill Upgrade Components
// =====================================
const SkillUpgrade = ({ skill }: any) => {
   const skilldat = skill.skill;
   const unlock = skill.unlock;
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
         <div className="flex items-start gap-3 pt-3 mt-3 border-t-2 border-dashed border-color-sub">
            <div className="size-10 flex-none">
               <Image height={80} url={skill_icon} alt="SkillIcon" />
            </div>
            <div className="flex-grow">
               <div className="flex items-start justify-between">
                  <div className="font-bold text-sm">{skill_name}</div>
                  <button
                     onClick={() => setOpen(!open)}
                     className={clsx(
                        open
                           ? "bg-blue-100 text-blue-600 border-blue-300 dark:text-blue-200 dark:bg-blue-900 dark:border-blue-800"
                           : "bg-blue-50 border-blue-200 dark:text-blue-200 text-blue-400 dark:bg-blue-950 dark:border-blue-900",
                        "flex items-center gap-1 text-[10px] font-semibold border shadow-sm shadow-1 rounded-md pl-2 pr-1 py-0.5",
                     )}
                  >
                     <span>Show Info</span>
                     <div
                        className={clsx(
                           open
                              ? "transform rotate-180 text-blue-500 dark:text-blue-200 font-bold "
                              : "dark:text-blue-300 ",
                        )}
                     >
                        <Icon size={16} name="chevron-down" />
                     </div>
                  </button>
               </div>
               <div
                  className="text-xs whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                     __html: skill_description
                        .replace(
                           /\<i class=\"fa fa-caret-up\" aria-hidden=\"true\"\>\<\/i\>/g,
                           "▲",
                        )
                        .replace(/\<br\>/g, "")
                        .replace(/\<p\>\r\n/g, "<p>"),
                  }}
               ></div>
               <div
                  className="border-t text-xs border-color-sub pt-2 mt-2"
                  dangerouslySetInnerHTML={{ __html: unlock }}
               />
            </div>
         </div>
         {open ? (
            <table
               className="text-xs text-center mt-3 w-full skill-table"
               dangerouslySetInnerHTML={{ __html: skilltablehtml }}
            ></table>
         ) : null}
         {skill.upgrades
            ? skill.upgrades.map((upg: any) => (
                 <SkillUpgrade key={upg.id} skill={upg} />
              ))
            : null}
      </>
   );
};

// =====================================
// 3) Append Skills
// =====================================
const AppendSkillDisplay = ({ skill }: any) => {
   const skill_name = skill?.name;
   const skill_icon = skill?.skill_image?.icon?.url;
   const skill_value_table = skill?.effect_value_table;
   const skill_description = skill?.description;

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
   `;
   const [open, setOpen] = useState(false);

   return (
      <>
         <div className="p-3 border border-color-sub rounded-lg mb-3 shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
            <div className="flex items-start gap-3">
               <div className="size-10 flex-none pt-1">
                  <Image height={80} url={skill_icon} alt="SkillIcon" />
               </div>
               <div className="flex-grow">
                  <div className="flex items-end justify-between pb-1">
                     <div className="font-bold text-sm">{skill_name}</div>
                     <button
                        onClick={() => setOpen(!open)}
                        className={clsx(
                           open
                              ? "bg-blue-100 text-blue-600 border-blue-300 dark:text-blue-200 dark:bg-blue-900 dark:border-blue-800"
                              : "bg-blue-50 border-blue-200 dark:text-blue-200 text-blue-400 dark:bg-blue-950 dark:border-blue-900",
                           "flex items-center gap-1 text-[10px] font-semibold border shadow-sm shadow-1 rounded-md pl-2 pr-1 py-0.5",
                        )}
                     >
                        <span>Show Info</span>
                        <div
                           className={clsx(
                              open
                                 ? "transform rotate-180 text-blue-500 dark:text-blue-200 font-bold "
                                 : "dark:text-blue-300 ",
                           )}
                        >
                           <Icon size={16} name="chevron-down" />
                        </div>
                     </button>
                  </div>
                  <div
                     className="text-xs whitespace-pre-wrap"
                     dangerouslySetInnerHTML={{
                        __html: skill_description
                           .replace(/\<br\>/g, "")
                           .replace(/\<p\>\r\n/g, "<p>"),
                     }}
                  ></div>
               </div>
            </div>
            {open ? (
               <table
                  className="text-xs text-center mt-3 w-full skill-table overflow-auto"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
               ></table>
            ) : null}
         </div>
      </>
   );
};

// =====================================
// 4) Class Skills
// =====================================
const ClassSkillDisplay = ({ skill }: any) => {
   const skill_name = skill?.name;
   const skill_icon = skill?.skill_image?.icon?.url;
   const skill_description = skill?.description;

   return (
      <>
         <div className="p-3 border border-color-sub rounded-lg mb-3 shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
            <div className="flex items-start gap-3">
               <div className="size-10 flex-none">
                  <Image height={80} url={skill_icon} alt="SkillIcon" />
               </div>
               <div className="flex-grow">
                  <div className="font-bold text-sm">{skill_name}</div>
                  <div
                     className="mt-1 text-sm whitespace-pre-wrap"
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
