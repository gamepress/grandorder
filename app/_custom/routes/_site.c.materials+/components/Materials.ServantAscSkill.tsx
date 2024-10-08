import { Fragment, useState } from "react";

import { Link } from "@remix-run/react";
import clsx from "clsx";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function MaterialsServantAscSkill({ data }: { data: any }) {
   const [tab, setTab] = useState(0); // 0 = Individual, 1 = Total Asc, 2 = Total Skill, 3 = Total Asc+Skill, 4 = Total Append, 5 = Total All

   const tab_options = [
      "Individual",
      "Total (Asc.)",
      "Total (Skill)",
      "Total (Asc. + Skill)",
      "Total (Append)",
      "Total (All)",
   ];

   return (
      <>
         {/* Tabs */}
         <div className="grid grid-cols-3 gap-2">
            {tab_options.map((tb, ti) => (
               <button
                  key={ti}
                  className={clsx(
                     tab == ti
                        ? "dark:bg-dark500 dark:border-zinc-400/70 bg-blue-50 border-blue-200"
                        : "dark:bg-dark400 bg-zinc-50 border-color-sub",
                     "rounded-lg p-2 shadow-sm shadow-1 border  font-bold text-sm",
                  )}
                  onClick={() => setTab(ti)}
               >
                  {tb}
               </button>
            ))}
         </div>
         <div>
            {tab == 0 ? (
               <IndividualTotals data={data} />
            ) : tab == 1 ? (
               <AscensionTotals data={data} />
            ) : tab == 2 ? (
               <SkillTotals data={data} />
            ) : tab == 3 ? (
               <AscSkillTotals data={data} />
            ) : tab == 4 ? (
               <AppendTotals data={data} />
            ) : tab == 5 ? (
               <AllTotals data={data} />
            ) : null}
         </div>
      </>
   );
}

const IndividualTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.entry?.data?.ascensionData?.docs;
   const skill = data?.entry?.data?.skillData?.docs;
   const append = data?.entry?.data?.appendData?.docs;

   // Calculate Individual Ascension Values
   const asc_text = ["1st", "2nd", "3rd", "Max"];
   let asc_individual = [];
   for (let asclv = 0; asclv < 4; asclv++) {
      let filtered_ascension_lv = ascension
         ?.map((asc: any) => {
            return {
               ...asc,
               ascension_materials: [asc.ascension_materials[asclv]],
            };
         })
         .filter((a) => JSON.stringify(a).indexOf(material?.id) > -1);
      const asc_level_total = CalculateTotals(
         filtered_ascension_lv,
         material?.id,
         "ascension_materials",
      );
      asc_individual.push(asc_level_total);
   }

   // Loop through each Skill Enhancement Level
   const skill_text = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
   ];
   let skill_individual = [];
   for (let asclv = 0; asclv < 9; asclv++) {
      let filtered_skill_lv = skill
         ?.map((asc: any) => {
            return {
               ...asc,
               skill_enhancements: [asc.skill_enhancements[asclv]],
            };
         })
         .filter((a: any) => JSON.stringify(a).indexOf(material?.id) > -1);
      const skill_level_total = CalculateTotals(
         filtered_skill_lv,
         material?.id,
         "skill_enhancements",
      );
      skill_individual.push(skill_level_total);
   }

   //Append Skills
   let append_individual = [];
   for (let asclv = 0; asclv < 9; asclv++) {
      let filtered_append_lv = append
         ?.map((asc: any) => {
            return {
               ...asc,
               append_skill_enhancements: [
                  asc.append_skill_enhancements[asclv],
               ],
            };
         })
         .filter((a: any) => JSON.stringify(a).indexOf(material?.id) > -1);
      const append_level_total = CalculateTotals(
         filtered_append_lv,
         material?.id,
         "append_skill_enhancements",
      );
      append_individual.push(append_level_total);
   }

   return (
      <>
         {/* Ascension Individual */}
         {asc_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2 key={index + "asch2"}>
                        {`${asc_text[index]} Ascension`}
                     </H2>
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "asctable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}

         {/* Skill Individual */}
         {skill_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2
                        key={index + "skillh2"}
                     >{`${skill_text[index]} Skill Enhancement`}</H2>
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "skilltable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}

         {/* Append Individual */}
         {append_individual?.map((ascindiv, index) => (
            <Fragment key={index}>
               {ascindiv?.length > 0 ? (
                  <>
                     <H2 key={index + "appendh2"}>
                        {`${skill_text[index]} Append Skill Enhancement`}
                     </H2>
                     <ServantTotalTable
                        tabledata={ascindiv}
                        key={index + "appendtable"}
                     />
                  </>
               ) : null}
            </Fragment>
         ))}
      </>
   );
};

const AscensionTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.entry?.data?.ascensionData?.docs;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );

   // Loop through each Skill Enhancement Level

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2>Total (Ascension)</H2>
               <ServantTotalTable tabledata={ascension_totals} />
            </>
         ) : null}
      </>
   );
};

const SkillTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const skill = data?.entry?.data?.skillData?.docs;

   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );

   const skill_final = skill_totals.map((a) => {
      return { ...a, total: a.total + " (" + a.total * 3 + ")" };
   });

   // Loop through each Skill Enhancement Level

   return (
      <>
         {skill?.length > 0 ? (
            <>
               <H2>Total (Skill)</H2>
               <ServantTotalTable tabledata={skill_final} />
            </>
         ) : null}
      </>
   );
};

const AscSkillTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.entry?.data?.ascensionData?.docs;
   const skill = data?.entry?.data?.skillData?.docs;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );
   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );

   const asc_skill_totals = [
      ...ascension_totals,
      ...skill_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
   ];

   const asc_skill_final = ConsolidateServantTotals(asc_skill_totals);

   // Loop through each Skill Enhancement Level

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2>Total (Asc. + Skill)</H2>
               <ServantTotalTable tabledata={asc_skill_final} />
            </>
         ) : null}
      </>
   );
};

const AppendTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const append = data?.entry?.data?.appendData?.docs;

   // Calculate Append Skill Totals
   const append_totals = CalculateTotals(
      append, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "append_skill_enhancements", // Field name the contains materials
   );

   const append_final = append_totals.map((a) => {
      return { ...a, total: a.total + " (" + a.total * 3 + ")" };
   });

   // Loop through each Skill Enhancement Level

   return (
      <>
         {append?.length > 0 ? (
            <>
               <H2>Total (Append)</H2>
               <ServantTotalTable tabledata={append_final} />
            </>
         ) : null}
      </>
   );
};

const AllTotals = ({ data }: any) => {
   const material = data?.entry?.data?.Material;
   const ascension = data?.entry?.data?.ascensionData?.docs;
   const skill = data?.entry?.data?.skillData?.docs;
   const append = data?.entry?.data?.appendData?.docs;

   // Calculate Ascension Totals
   const ascension_totals = CalculateTotals(
      ascension, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "ascension_materials", // Field name the contains materials
   );
   // Calculate Skill Totals
   const skill_totals = CalculateTotals(
      skill, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "skill_enhancements", // Field name the contains materials
   );
   // Calculate Append Skill Totals
   const append_totals = CalculateTotals(
      append, // Data containing full format of ascension materials
      material?.id, // ID for material to total counts for
      "append_skill_enhancements", // Field name the contains materials
   );

   const asc_skill_append_totals = [
      ...ascension_totals,
      ...skill_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
      ...append_totals.map((a) => {
         return { ...a, total: a.total * 3 };
      }),
   ];

   const all_final = ConsolidateServantTotals(asc_skill_append_totals);

   return (
      <>
         {ascension?.length > 0 ? (
            <>
               <H2>Total (All)</H2>
               <ServantTotalTable tabledata={all_final} />
            </>
         ) : null}
      </>
   );
};

function ConsolidateServantTotals(inputdata) {
   let final_data = [];

   inputdata.map((idat) => {
      const sindex = final_data.findIndex(
         (a) => a.servant?.id == idat.servant?.id,
      );
      if (sindex > -1) {
         final_data[sindex].total += idat.total;
      } else {
         final_data.push({ ...idat });
      }
   });

   return final_data;
}

function CalculateTotals(inputdata, materialid, matfieldname) {
   let total = inputdata?.map((asc) => {
      let final_total = 0;
      const asctext = JSON.stringify(asc[matfieldname]);
      const counted = asctext
         .split('material":{"id":"')
         .filter((t) => t.indexOf(materialid) > -1);
      counted.map((countmat) => {
         final_total += parseInt(
            countmat.replace(/.*qty":/, "").replace(/}.*/g, ""),
         );
      });

      return {
         servant: {
            name: asc.name,
            id: asc.id,
            slug: asc.slug,
            icon: {
               url: asc.icon.url,
            },
         },
         total: final_total,
      };
   });
   return total;
}

const ServantTotalTable = ({ tabledata }: any) => {
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader>Servant</TableHeader>
                  <TableHeader center>Amount</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {/* @ts-ignore */}
               {tabledata?.map((row, index) => (
                  <TableRow key={index + "tdata"}>
                     <TableCell>
                        <Link
                           className="flex items-center gap-3"
                           to={`/c/servants/${row.servant?.slug}`}
                        >
                           <Image
                              height={100}
                              width={100}
                              className="w-10 flex-none"
                              url={row.servant?.icon?.url}
                              alt="icon"
                              loading="lazy"
                           />
                           <div className="font-bold flex-grow">
                              {row.servant?.name}
                           </div>
                        </Link>
                     </TableCell>
                     <TableCell center>x{row.total}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};
