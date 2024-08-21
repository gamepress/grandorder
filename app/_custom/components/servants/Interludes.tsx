import type { Servant as ServantType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";

import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";

const tdformat = "p-2 leading-none border border-color-sub";

export const Interludes = ({ data }: { data: any }) => {
   const servant = data.servant;
   return (
      <>
         <InterludeList character={servant} />
      </>
   );
};

const InterludeList = ({ character }: any) => {
   const interlude_quests = character?.interlude_quests;

   if (interlude_quests?.length > 0) {
      return (
         <>
            <H2 text="Interlude Quests" />
            <Table grid framed>
               <TableHead>
                  <TableRow>
                     <TableHeader>Quest</TableHeader>
                     <TableHeader>Requirements</TableHeader>
                     <TableHeader center>Reward</TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {interlude_quests?.map((int, index) => {
                     const questname = int.quest?.name;
                     const questid = int.quest?.id;
                     const chaptername = int.chapter?.name;
                     const ascension = int.ascension;
                     const bond = int.bond;
                     const rewardicon = int.interlude_reward?.icon?.url;
                     const rewardtext = int.specific_info;
                     const available = int.available ? "✔" : "✖"; //  Display status for interlude

                     return (
                        <TableRow key={index}>
                           <td className={`${tdformat}`}>
                              <div>
                                 {available}
                                 <a
                                    className="text-blue-500"
                                    href={`/c/quests/${questid}`}
                                 >
                                    {questname}
                                 </a>
                              </div>
                              <div className="text-xs my-1">
                                 <span className="font-bold mr-1">
                                    Chapter Completion:
                                 </span>
                                 {chaptername}
                              </div>
                           </td>
                           <td className={`${tdformat}`}>
                              <div className="my-1">
                                 <span className="font-bold">Ascension:</span>
                                 {ascension}
                              </div>
                              <div className="my-1">
                                 <span className="font-bold">Bond:</span>
                                 {bond}
                              </div>
                           </td>
                           <td className={`text-center ${tdformat}`}>
                              <img
                                 src={rewardicon ?? "no_image_42df124128"}
                                 className={`object-contain h-12 inline-block`}
                                 alt={"Icon"}
                                 loading="lazy"
                              />
                              {rewardtext ? (
                                 <div className="mt-1">{rewardtext}</div>
                              ) : null}
                           </td>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </>
      );
   } else return null;
};
