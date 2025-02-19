import { Fragment } from "react";

import { H2 } from "~/components/Headers";
import {
   Table,
   TableBody,
   TableCell,
   TableHeader,
   TableRow,
} from "~/components/Table";

export function QuestsMain({ data }: { data: any }) {
   const overview_text = data.quest_content;

   const info = [
      {
         name: "AP Cost",
         value: data?.ap_cost,
      },
      {
         name: "Bond Points",
         value: data.bond_points?.toLocaleString(),
      },
      {
         name: "QP",
         value: data.qp?.toLocaleString(),
      },
      {
         name: "Quest EXP",
         value: data.exp?.toLocaleString(),
      },
      {
         name: "Quest Type",
         value: data.quest_type?.name,
      },
   ];

   // For proper formatting of inline ul elements in description!
   const formatting = `<style>
   div.main ul {list-style-type: disc;margin: 0 0 .75em 25px;} div.main a {color: rgb(100,100,255);}
   </style>`;

   return (
      <>
         <div dangerouslySetInnerHTML={{ __html: formatting }}></div>
         <Table grid framed dense>
            <TableBody>
               {info?.map((irow: any, ind: any) => {
                  return (
                     <Fragment key={ind}>
                        {irow?.value ? (
                           <>
                              <TableRow key={"additional_info_" + ind}>
                                 <TableHeader
                                    className="!border-0 w-1/2"
                                    key={"info_row_" + ind}
                                 >
                                    {irow?.name}
                                 </TableHeader>
                                 <TableCell key={"info_value_" + ind}>
                                    {irow?.value}
                                 </TableCell>
                              </TableRow>
                           </>
                        ) : null}
                     </Fragment>
                  );
               })}
            </TableBody>
         </Table>
         {overview_text?.length > 0 ? (
            <>
               <H2>Quest Overview</H2>
               {overview_text.map((ot: any, oti: number) => (
                  <div
                     className="main"
                     key={oti}
                     dangerouslySetInnerHTML={{ __html: ot.text }}
                  ></div>
               ))}
            </>
         ) : null}
      </>
   );
}
