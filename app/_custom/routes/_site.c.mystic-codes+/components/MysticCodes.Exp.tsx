import type { MysticCode } from "payload/generated-custom-types";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

export const MysticCodesExp = ({ data }: { data: MysticCode }) => {
   return (
      <>
         <ExpTable data={data} />
      </>
   );
};

const ExpTable = ({ data }: { data: MysticCode }) => {
   const exp = data.level_exp;

   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader center>Current Level</TableHeader>
                  <TableHeader center>Next Level</TableHeader>
                  <TableHeader center>Required EXP</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {exp?.map((value: any, index: number) => (
                  <TableRow key={index}>
                     <TableCell center>{index + 1}</TableCell>
                     <TableCell center>{value?.toLocaleString()}</TableCell>
                     <TableCell center>
                        {/* Calculate cumulative sum up to current level */}
                        {/* @ts-ignore */}
                        {exp
                           .slice(0, index)
                           ?.reduce((a, b) => a + b, 0)
                           ?.toLocaleString()}
                     </TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};
