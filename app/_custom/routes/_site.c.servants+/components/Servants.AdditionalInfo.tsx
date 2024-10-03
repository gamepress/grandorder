import { Link } from "@remix-run/react";

import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2Plain } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function AdditionalInfo({ data }: { data: any }) {
   const servant = data.servant;

   const ce = data.ceData;
   const bond_ce = ce?.filter((a: any) => a.is_bond_ce == true);

   return (
      <>
         <TableInfo data={servant} />
         <H2Plain text="Bond" />
         <BondTable data={servant} />
         {bond_ce?.map((bc: any) => (
            <div
               className="flex items-center gap-3 shadow-sm shadow-1 bg-2-sub border border-color-sub px-3 py-2 rounded-xl mb-3"
               key={bc?.id}
            >
               <Link
                  to={`/c/craft-essences/${bc?.slug ?? bc?.id}`}
                  className="size-14 rounded-md flex-none"
               >
                  <Image
                     width={100}
                     height={100}
                     url={bc?.icon?.url ?? "no_image_42df124128"}
                     alt={bc?.name}
                     loading="lazy"
                  />
               </Link>
               <div className="space-y-0.5">
                  <Link
                     to={`/c/craft-essences/${bc?.slug ?? bc?.id}`}
                     className="font-bold text-sm font-mono text-blue-500"
                  >
                     {bc?.name}
                  </Link>
                  <div
                     className="text-sm"
                     dangerouslySetInnerHTML={{ __html: bc?.description }}
                  ></div>
               </div>
            </div>
         ))}
      </>
   );
}

function TableInfo({ data: servant }: { data: ServantType }) {
   const info = [
      {
         name: "Cost",
         value: servant?.cost,
      },
      {
         name: "Growth",
         value: servant?.growth_curve?.name,
      },
      {
         name: "Instant Death Chance",
         value: servant?.instant_death_chance,
      },
      {
         name: "Damage Distribution Quick",
         value: servant?.damage_distribution_quick,
      },
      {
         name: "Damage Distribution Arts",
         value: servant?.damage_distribution_arts,
      },
      {
         name: "Damage Distribution Buster",
         value: servant?.damage_distribution_buster,
      },
      {
         name: "Damage Distribution Extra",
         value: servant?.damage_distribution_extra,
      },
      {
         name: "Damage Distribution NP",
         value: servant?.damage_distribution_np,
      },
   ];

   return (
      <Table grid framed dense>
         <TableBody>
            {info?.map((irow: any, ind: any) => {
               return (
                  <TableRow key={"additional_info_" + ind}>
                     <TableHeader
                        className="border-b-0"
                        key={"info_row_" + ind}
                     >
                        {irow?.name}
                     </TableHeader>
                     <TableCell key={"info_value_" + ind}>
                        {irow?.value}
                     </TableCell>
                  </TableRow>
               );
            })}
         </TableBody>
      </Table>
   );
}

function BondTable({ data: servant }: { data: ServantType }) {
   const bond = servant?.bond_experience;

   return (
      <Table grid framed dense className="mb-2.5">
         <TableBody>
            <TableRow>
               <TableHeader>Bond Lv</TableHeader>
               {bond?.map((exp: any, ind: any) => (
                  <TableHeader key={"bond_exp_header_" + ind}>
                     {ind + 1}
                  </TableHeader>
               ))}
            </TableRow>
            <TableRow>
               <TableHeader className="border-b-0">Bond EXP</TableHeader>
               {bond?.map((exp: any, ind: any) => (
                  <TableCell key={"bond_exp_value_" + ind}>
                     {exp.toLocaleString()}
                  </TableCell>
               ))}
            </TableRow>
         </TableBody>
      </Table>
   );
}
