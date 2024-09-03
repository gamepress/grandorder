import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2Plain } from "~/components/Headers";
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
   return (
      <>
         <TableInfo data={servant} />
         <H2Plain text="Bond" />
         <BondTable data={servant} />
         <BondCE ce={ce} />
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
      <Table grid framed dense>
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
               <TableHeader>Bond EXP</TableHeader>
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

function BondCE({ ce }: { ce: any }) {
   const bond_ce = ce?.filter((a) => a.is_bond_ce == true);
   return (
      <>
         {bond_ce?.map((bc: any) => {
            return (
               <>
                  <div className="my-1 border border-color-sub rounded-sm p-3">
                     <div className="inline-block mr-1 align-middle">
                        <a href={`/c/craft-essences/${bc?.slug ?? bc?.id}`}>
                           <div className="relative mr-0.5 inline-block h-14 w-14 align-middle text-xs">
                              <img
                                 src={bc?.icon?.url ?? "no_image_42df124128"}
                                 className={`object-contain h-14`}
                                 alt={bc?.name}
                                 loading="lazy"
                              />
                           </div>
                        </a>
                     </div>
                     <div className="inline-block align-middle">
                        <div>
                           <a href={`/c/craft-essences/${bc?.slug ?? bc?.id}`}>
                              <div className="text-base text-blue-500">
                                 {bc?.name}
                              </div>
                           </a>
                        </div>
                        <div
                           className="text-sm"
                           dangerouslySetInnerHTML={{ __html: bc?.description }}
                        ></div>
                     </div>
                  </div>
               </>
            );
         })}
      </>
   );
}
