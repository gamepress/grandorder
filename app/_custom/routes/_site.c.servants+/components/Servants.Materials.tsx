import { H2Plain } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

const qtyformat = `
<style>
   .grandorder-material-qty {
      text-shadow: 1px 0 0 #000,0 -1px 0 #000,0 1px 0 #000,-1px 0 0 #000;
   }
</style>
`;

export const Materials = ({ data }: { data: any }) => {
   const servant = data.servant;
   return (
      <>
         <div dangerouslySetInnerHTML={{ __html: `${qtyformat}` }}></div>
         <SectionTitle customTitle="Materials" />
         <H2Plain text="Ascension Materials" />
         <AscensionMaterials character={servant} />

         <H2Plain text="Skill Enhancement Materials" />
         <SkillMaterials character={servant} />

         <H2Plain text="Append Skill Materials" />
         <AppendMaterials character={servant} />

         <H2Plain text="Total Materials Required" />
         <TotalMaterials character={servant} />

         <H2Plain text="Costume Dress Materials" />
         <CostumeMaterials character={servant} />
      </>
   );
};

const AscensionMaterials = ({ character }: any) => {
   const stages = ["2", "3", "4", "Max"];
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader center>Stage</TableHeader>
                  <TableHeader center>Cost</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {character.ascension_materials?.map(
                  (asc: any, index: number) => (
                     <TableRow key={index}>
                        <TableCell center>{stages[index]}</TableCell>
                        <TableCell center>
                           {asc?.qp_cost?.toLocaleString()}
                        </TableCell>
                        <TableCell>
                           {asc.materials?.map((mat, key) => (
                              <MaterialQtyFrame
                                 materialqty={mat}
                                 key={"ascension_mats_" + key}
                              />
                           ))}
                        </TableCell>
                     </TableRow>
                  ),
               )}
            </TableBody>
         </Table>
      </>
   );
};

const SkillMaterials = ({ character }: any) => {
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader center>Level</TableHeader>
                  <TableHeader center>Cost</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {character.skill_enhancements?.map((enh, index) => (
                  <TableRow key={index}>
                     <TableCell center>
                        {index + 1} → {index + 2}
                     </TableCell>
                     <TableCell center>
                        {enh?.qp_cost?.toLocaleString()}
                     </TableCell>
                     <TableCell>
                        {enh.materials?.map((mat, key) => (
                           <MaterialQtyFrame
                              materialqty={mat}
                              key={"skill_mats_" + key}
                           />
                        ))}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};

const AppendMaterials = ({ character }: any) => {
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader center>Level</TableHeader>
                  <TableHeader center>Cost</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {character.append_skill_enhancements?.map((enh, index) => (
                  <TableRow key={index}>
                     <TableCell center>
                        {index + 1} → {index + 2}
                     </TableCell>
                     <TableCell center>
                        {enh?.qp_cost?.toLocaleString()}
                     </TableCell>
                     <TableCell>
                        {enh.materials?.map((mat, key) => (
                           <MaterialQtyFrame
                              materialqty={mat}
                              key={"append_mats_" + key}
                           />
                        ))}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};

const TotalMaterials = ({ character }: any) => {
   // Three totals:
   // 1) Ascension total
   // 2) Skill total
   // 3) Append total
   // 4) Ascension + Skill total
   // 5) ALL Total

   // 1) Calculate Ascension total
   // ======================
   const ascData = character.ascension_materials;
   let ascensionTotal = CalculateTotals(ascData);
   let ascensionQP = ascData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

   // 2) Calculate Skill total
   // ======================
   const skillData = character.skill_enhancements;
   let skillTotal = CalculateTotals(skillData);
   let skillQP = skillData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

   // 3) Calculate Append total
   // ======================
   const appendData = character.append_skill_enhancements;
   let appendTotal = CalculateTotals(appendData);
   let appendQP = appendData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

   // 4) Calculate Ascension + Skill total
   // ======================
   const ascSkillData = [...ascData, ...skillData];
   let ascSkillTotal = CalculateTotals(ascSkillData);
   let ascSkillQP = ascSkillData
      .map((a) => a.qp_cost)
      .reduce((ps, a) => ps + a, 0);

   // 5) Calculate All total
   // ======================
   const allData = [...ascData, ...skillData, ...appendData];
   let allTotal = CalculateTotals(allData);
   let allQP = allData.map((a) => a.qp_cost).reduce((ps, a) => ps + a, 0);

   const displayTotals = [
      {
         name: "Ascension",
         qp: ascensionQP,
         data: ascensionTotal,
      },
      {
         name: "Skill",
         qp: skillQP,
         data: skillTotal,
      },
      {
         name: "Append Skill",
         qp: appendQP,
         data: appendTotal,
      },
      {
         name: "Ascension + Skill",
         qp: ascSkillQP,
         data: ascSkillTotal,
      },
      {
         name: "Total",
         qp: allQP,
         data: allTotal,
      },
   ];

   return (
      <>
         <Table grid framed dense>
            <TableBody>
               {displayTotals?.map((row, index) => (
                  <TableRow key={index}>
                     <TableHeader center>{row.name}</TableHeader>
                     <TableCell>
                        <div className="w-full">
                           {row.data?.map((mat, key) => (
                              <MaterialQtyFrame
                                 materialqty={mat}
                                 key={"total_" + row.name + "_" + key}
                              />
                           ))}
                        </div>
                        <div className="flex items-center gap-2">
                           <div className="size-8">
                              <Image
                                 width={80}
                                 url={
                                    "https://static.mana.wiki/grandorder/Qp.png"
                                 }
                                 alt="QP"
                                 loading="lazy"
                              />
                           </div>
                           <div className="inline-block align-middle font-bold text-sm">
                              x{row.qp?.toLocaleString("en-US")}
                           </div>
                        </div>
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};

const CostumeMaterials = ({ character }: any) => {
   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader>Costume</TableHeader>
                  <TableHeader>Cost</TableHeader>
                  <TableHeader>Materials</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {character.costumes?.map((costume, index) => (
                  <TableRow key={index}>
                     <TableCell>{costume?.name}</TableCell>
                     <TableCell>
                        {costume?.costume_materials?.[0]?.qp_cost?.toLocaleString(
                           "en-US",
                        )}
                     </TableCell>
                     <TableCell>
                        {costume?.costume_materials?.[0]?.materials?.map(
                           (mat, key) => (
                              <MaterialQtyFrame
                                 materialqty={mat}
                                 key={"costume_mat_" + key}
                              />
                           ),
                        )}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};

const MaterialQtyFrame = ({ materialqty }: any) => {
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
               <div className="absolute z-10 -bottom-0.5 right-2 text-sm text-white grandorder-material-qty">
                  {qty}
               </div>
            </a>
         </div>
      </>
   );
};

function CalculateTotals(matlist: any) {
   let matTotal = [];

   if (matlist && matlist?.length > 0) {
      for (let i = 0; i < matlist?.length; i++) {
         const material_qty = matlist?.[i]?.materials;
         if (!material_qty) break;
         for (let j = 0; j < material_qty.length; j++) {
            const currMat = { ...material_qty?.[j] };
            const existIndex = matTotal.findIndex(
               (a) => a.material?.id == currMat.material?.id,
            );
            if (existIndex == -1) {
               matTotal.push(currMat);
            } else {
               matTotal[existIndex].qty += currMat.qty;
            }
         }
      }
   }

   return matTotal;
}