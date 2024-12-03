import { gql, request as gqlRequest } from "graphql-request";
import { Image } from "~/components/Image";
import { Icon } from "~/components/Icon";

import useSWR from "swr";
import { useState } from "react";
import clsx from "clsx";

import { Loading } from "~/components/Loading";

type Props = {
   refId: String;
};

export const ServantSkillView = ({ refId }: Props) => {
   const skillid = refId;

   if (!skillid) return null;

   const { data, error, isLoading } = useSWR(
      gql`
         query {
            ServantSkill(id: "${skillid}") {
               id
               name
               _skill_Image {
                  icon {
                     url
                  }
               }
               cooldown
               description
               effect_value_table
            }
         }
      `,
      (query: any) =>
         gqlRequest("https://grandorder.gamepress.gg:4000/api/graphql", query),
   );
   if (error) return null;
   if (isLoading) return <Loading />;

   //@ts-ignore
   const skill = data?.ServantSkill;

   return (
      <div contentEditable={false} className="cursor-default">
         <SkillDisplay skill={skill} />
      </div>
   );
};

const SkillDisplay = ({ skill }: any) => {
   const skilldat = skill;
   const skill_name = skilldat?.name;
   const skill_icon = skilldat?._skill_Image?.icon?.url;
   const skill_value_table = skilldat?.effect_value_table;
   const skill_description = skilldat?.description;
   const cd = skilldat.cooldown ?? 0;

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
      <div className="p-3 border border-color-sub rounded-lg shadow-1 shadow-sm bg-zinc-50 dark:bg-dark350">
         <div className="flex items-start gap-3">
            <Image
               className="size-10 mt-1"
               height={80}
               url={skill_icon}
               alt="SkillIcon"
               loading="lazy"
            />
            <div className="flex-grow">
               <div className="font-bold text-base pb-0.5">{skill_name}</div>
               <div
                  className="text-sm whitespace-pre-wrap pb-1"
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
                     "flex items-center justify-between gap-1 text-[10px]  border rounded-md pl-2 pr-1 w-full py-1 font-bold",
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
                  className="text-xs text-center mt-3 w-full skill-table"
                  dangerouslySetInnerHTML={{ __html: skilltablehtml }}
               ></table>
            </div>
         ) : null}
      </div>
   );
};
