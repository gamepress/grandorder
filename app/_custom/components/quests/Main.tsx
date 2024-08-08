import type { Quest as QuestType } from "payload/generated-custom-types";
import { H2 } from "~/components/Headers";
import { Fragment } from "react";

const thformat =
   "p-2 leading-none text-left border border-color-sub bg-zinc-50 dark:bg-zinc-800";
const tdformat = "p-2 leading-none text-center border border-color-sub";

export function Main({ data }: { data: any }) {
   return (
      <>
         <Table_Info data={data} />
         <Quest_Overview data={data} />
      </>
   );
}

function Table_Info({ data: quest }: { data: QuestType }) {
   const info = [
      {
         name: "AP Cost",
         value: quest?.ap_cost,
      },
      {
         name: "Bond Points",
         value: quest.bond_points,
      },
      {
         name: "QP",
         value: quest.qp,
      },
      {
         name: "Quest EXP",
         value: quest.exp,
      },
      {
         name: "Quest Type",
         value: quest.quest_type?.name,
      },
   ];

   return (
      <>
         <div className="my-1">
            <table className="text-sm w-full ">
               <tbody>
                  {info?.map((irow: any, ind: any) => {
                     return (
                        <Fragment key={ind}>
                           {irow?.value ? (
                              <>
                                 <tr key={"additional_info_" + ind}>
                                    <th
                                       className={thformat}
                                       key={"info_row_" + ind}
                                    >
                                       {irow?.name}
                                    </th>
                                    <td
                                       className={tdformat}
                                       key={"info_value_" + ind}
                                    >
                                       {irow?.value}
                                    </td>
                                 </tr>
                              </>
                           ) : null}
                        </Fragment>
                     );
                  })}
               </tbody>
            </table>
         </div>
      </>
   );
}

function Quest_Overview({ data: quest }: { data: QuestType }) {
   const overview_text = quest.quest_content;
   return (
      <>
         {overview_text?.length > 0 ? (
            <>
               <H2 text="Quest Overview" />
               {overview_text.map((ot, oti) => (
                  <div
                     className=""
                     key={oti}
                     dangerouslySetInnerHTML={{ __html: ot.text }}
                  ></div>
               ))}
            </>
         ) : null}
      </>
   );
}
