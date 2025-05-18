import { BadgeButton } from "~/components/Badge";
import { Link } from "@remix-run/react";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { SectionTitle } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/SectionTitle";

export function MaterialsDropLocation({ data }: { data: any }) {
   const material = data?.entry?.data?.Material;
   const droplocs = material?.best_drop_locations;

   return (
      <>
         {droplocs?.length > 0 ? (
            <>
               <SectionTitle customTitle="Best Drop Locations" />
               <DropLocationList data={droplocs} />
               <DropNotes />
            </>
         ) : null}
      </>
   );
}

const DropNotes = () => {
   return (
      <>
         <div className="pb-3 pt-5 mb-3 border-b border-color-sub text-center ">
            <div>
               <span className="font-bold">APD</span> = Avg AP Per Drop
            </div>
            <div>
               The most efficient quests to farm for the item. Lower is better.
            </div>
         </div>
         <div className="text-xs text-center mb-3">
            Drop rate estimates based on data collected by{" "}
            <BadgeButton
               color="blue"
               target="_blank"
               href="https://www.reddit.com/user/Rathus"
            >
               /u/Rathus
            </BadgeButton>{" "}
            and the{" "}
            <BadgeButton
               color="blue"
               target="_blank"
               href="https://www.reddit.com/r/grandorder"
            >
               Grand Order Subreddit
            </BadgeButton>
         </div>
      </>
   );
};

const DropLocationList = ({ data }: any) => {
   // Sort drops first!
   let sorted = [...data];
   sorted.sort((a, b) =>
      a.ap_per_drop > b.ap_per_drop
         ? 1
         : b.ap_per_drop > a.ap_per_drop
         ? -1
         : 0,
   );

   return (
      <>
         <Table grid framed dense>
            <TableHead>
               <TableRow>
                  <TableHeader>Quest</TableHeader>
                  <TableHeader center>APD ▴</TableHeader>
               </TableRow>
            </TableHead>
            <TableBody>
               {sorted?.map((loc, index) => (
                  <TableRow key={index}>
                     <TableCell>
                        <Link to={`/c/quests/${loc?.quest_dropped_from?.id}`}>
                           <div className="text-blue-500 font-bold">
                              {loc?.quest_dropped_from?.name}
                           </div>
                        </Link>
                        <div className="text-xs text-1">
                           {loc?.quest_dropped_from?.main_quest?.name} -{" "}
                           {loc?.quest_dropped_from?.main_quest_chapter?.name}
                        </div>
                     </TableCell>
                     <TableCell center>{loc?.ap_per_drop}</TableCell>
                  </TableRow>
               ))}
            </TableBody>
         </Table>
      </>
   );
};
