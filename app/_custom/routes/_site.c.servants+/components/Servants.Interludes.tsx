import { Badge } from "~/components/Badge";
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

export const Interludes = ({ data }: { data: any }) => {
   const servant = data.servant;
   const interlude_quests = servant?.interlude_quests;
   if (interlude_quests?.length > 0) {
      return (
         <>
            <SectionTitle customTitle="Interlude Quests" />
            <Table dense grid framed>
               <TableHead>
                  <TableRow>
                     <TableHeader>Quest</TableHeader>
                     <TableHeader>Requirements</TableHeader>
                     <TableHeader center>Reward</TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {interlude_quests?.map((int: any, index: number) => {
                     const questname = int.quest?.name;
                     const questnick = int.quest_nickname;
                     const questid = int.quest?.id;
                     const chaptername = int.chapter?.name;
                     const ascension = int.ascension;
                     const bond = int.bond;
                     const rewardicon = int.interlude_reward?.icon?.url;
                     const rewardtext = int.specific_info;
                     const available = int.available ? "✔" : "✖"; //  Display status for interlude

                     return (
                        <TableRow key={index}>
                           <TableCell>
                              <div>
                                 {available}{" "}
                                 {questid ? (
                                    <a
                                       className="text-blue-500"
                                       href={`/c/quests/${questid}`}
                                    >
                                       {questnick}
                                    </a>
                                 ) : (
                                    <>{questnick}</>
                                 )}
                              </div>
                              <div className="text-xs my-1">
                                 <span className="font-bold mr-1">
                                    Chapter Completion:
                                 </span>
                                 {chaptername}
                              </div>
                           </TableCell>
                           <TableCell>
                              <div className="flex items-center gap-1">
                                 <span className="text-1">Ascension:</span>
                                 <span className="font-bold">{ascension}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <span className="text-1">Bond:</span>
                                 <span className="font-bold">{bond}</span>
                              </div>
                           </TableCell>
                           <TableCell center>
                              <Image
                                 width={80}
                                 className="size-9 mx-auto"
                                 url={rewardicon ?? "no_image_42df124128"}
                                 alt={"Icon"}
                                 loading="lazy"
                              />
                              {rewardtext ? (
                                 <div className="mt-1 text-xs font-semibold text-1">
                                    {rewardtext}
                                 </div>
                              ) : null}
                           </TableCell>
                        </TableRow>
                     );
                  })}
               </TableBody>
            </Table>
         </>
      );
   } else return null;
};
