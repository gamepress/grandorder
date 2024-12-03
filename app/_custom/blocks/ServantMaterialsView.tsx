import { gql, request as gqlRequest } from "graphql-request";
import { H2 } from "~/components/Headers";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

import useSWR from "swr";

import { Loading } from "~/components/Loading";

type Props = {
   refId: String;
};

export const ServantMaterialsView = ({ refId }: Props) => {
   const servantid = refId;

   if (!servantid) return null;

   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Servant(id: "${servantid}") {
               id
               name
               slug
               ascension_materials {
                  qp_cost
                  materials {
                     material {
                        id
                        name
                        icon {
                           url
                        }
                     }
                     qty
                  }
               }
               skill_enhancements {
                  qp_cost
                  materials {
                     material {
                        id
                        name
                        icon {
                           url
                        }
                     }
                     qty
                  }
               }
               append_skill_enhancements {
                  qp_cost
                  materials {
                     material {
                        id
                        name
                        icon {
                           url
                        }
                     }
                     qty
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

   return (
      <div contentEditable={false} className="">
         <H2>Ascension Materials</H2>
         <AscensionMaterials data={servant} />

         <H2>Skill Enhancement Materials</H2>
         <SkillMaterials data={servant} />

         <H2>Append Skill Materials</H2>
         <AppendMaterials data={servant} />
      </div>
   );
};

function AscensionMaterials({ data }: any) {
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
               {data?.ascension_materials?.map((asc: any, index: number) => (
                  <TableRow key={index}>
                     <TableCell center>{stages[index]}</TableCell>
                     <TableCell center>
                        {asc?.qp_cost?.toLocaleString()}
                     </TableCell>
                     <TableCell>
                        {asc.materials?.map((mat: any, key: number) => (
                           <MaterialQtyFrame
                              materialqty={mat}
                              key={"ascension_mats_" + key}
                           />
                        ))}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
}

function SkillMaterials({ data }: any) {
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
               {data?.skill_enhancements?.map((enh, index) => (
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
}

function AppendMaterials({ data }: any) {
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
               {data?.append_skill_enhancements?.map((enh, index) => (
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
}

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
