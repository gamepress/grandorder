import { useEffect, useState } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, NavLink, useLoaderData, useNavigate } from "@remix-run/react";
import clsx from "clsx";
import { z } from "zod";
import { zx } from "zodix";

import { Avatar } from "~/components/Avatar";
import { Badge } from "~/components/Badge";
import { Button } from "~/components/Button";
import { CustomPageHeader } from "~/components/CustomPageHeader";
import { H2, H3 } from "~/components/Headers";
import { Icon } from "~/components/Icon";
import { Image } from "~/components/Image";
import { Select } from "~/components/Select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { Text, TextLink } from "~/components/Text";
import { Tooltip, TooltipTrigger, TooltipContent } from "~/components/Tooltip";
import { AdUnit } from "~/routes/_site+/_components/RampUnit";
import { fetchWithCache } from "~/utils/cache.server";

async function fetchGQL(query: string, variables?: Record<string, any>) {
   const { data, errors } = await fetchWithCache(
      `http://localhost:4000/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query,
            variables,
         }),
      },
      60000,
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      // throw new Error();
   }

   return data;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
   const { board } = zx.parseQuery(request, {
      board: z.string().optional(),
   });

   const [classScoreBoards] = await Promise.all([
      fetchGQL(ClassScoreBoardsQuery),
   ]);

   return json(
      {
         urldata: board,
         class_score_board: classScoreBoards._classScoreBoards?.docs,
         class_score_nodes: classScoreBoards._classScoreNodes?.docs,
         errorMessage: null,
      },
      { headers: { "Cache-Control": "public, s-maxage=60" } },
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Class Score Board | Fate/Grand Order Wiki - GamePress",
      },
      {
         name: "description",
         content: "Fate/Grand Order Class Score Board Planner",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const ClassScore = (data: any) => {
   //need banners, weapons, characters
   const loaderdata = useLoaderData<typeof loader>();
   const csboards = loaderdata?.class_score_board;
   const csnodes = loaderdata?.class_score_nodes;
   console.log(loaderdata);

   const [selectedClass, setSelectedClass] = useState("saber");
   const [selectedNode, setSelectedNode] = useState("");
   const [activeNodes, setActiveNodes] = useState(new Array(72).fill(0));

   const ClassSelection = () => {
      return (
         <>
            <div className="grid grid-cols-5 tablet:grid-cols-9 gap-3 tablet:gap-4 py-4 border-b-2 border-dotted border-color-sub mb-4">
               {csboards.map((c: any) => {
                  const cid = c.id;
                  const cicon = c.icon?.url;
                  return (
                     <div
                        className={`${
                           selectedClass == cid
                              ? "bg-blue-100 border-zinc-400/50 dark:bg-blue-600  dark:border-zinc-500/50"
                              : "bg-2-sub hover:border-zinc-300 dark:hover:border-zinc-600"
                        } 
                  flex items-center tablet:justify-center tablet:flex-col p-3 rounded-lg font-bold border border-color-sub shadow-sm shadow-1 text-sm gap-2 dark:bg-opacity-20 cursor-pointer`}
                        onClick={() => {
                           setSelectedClass(cid);
                           setSelectedNode("");
                        }}
                        key={"class-selection-" + cid}
                     >
                        <Image
                           height={40}
                           className="h-10 object-contain"
                           url={cicon}
                        />
                     </div>
                  );
               })}
            </div>
         </>
      );
   };

   const ClassScoreBoard = () => {
      const imageboard = csboards.find((csb: any) => csb.id == selectedClass)
         ?.image_board?.url;

      const classnodes = csnodes
         .filter((csn: any) => csn.class_score_board?.id == selectedClass)
         .sort((a, b) => parseInt(a.node) - parseInt(b.node));

      const snode =
         selectedNode != ""
            ? classnodes.find((n) => n.id == selectedNode)
            : null;

      const canvas_style = `
         <style>
         .canvas-board{position:relative;display:inline-block;height:425px;width:700px;float:center;background-size:contain;background-repeat:no-repeat;background-position:center center;background-image:url('${imageboard}');}
         </style>
      `;

      const InfoPopup = () => {
         const nid = snode?.id;
         const nicon = snode?.icon?.url;
         const posx = snode?.posx_left > 460 ? 460 : snode?.posx_left;
         const posy = snode?.posy_top > 275 ? 275 : snode?.posy_top;
         const efficon = snode?.effect_list?.[0]?.effect?.icon?.url;
         const name = snode?.name;
         const desc = snode?.desc;

         const qpmat = {
            material: {
               id: "4861",
               name: "QP",
               slug: "qp",
               icon: { url: "https://static.mana.wiki/grandorder/Qp.png" },
            },
            qty: snode?.unlock_materials?.[0]?.qp_cost,
         };

         const allmats = snode?.unlock_materials?.[0]?.qp_cost
            ? [qpmat, ...snode?.unlock_materials?.[0]?.materials]
            : snode?.unlock_materials?.[0]?.materials;

         return (
            <div
               className={`absolute w-60 bg-opacity-95 bg-slate-800 border rounded-md border-slate-900 p-2`}
               style={{
                  top: `${posy}px`,
                  left: `${posx}px`,
               }}
            >
               <div className="text-white pb-1 mb-1 border-b border-slate-500 text-sm">
                  <Image
                     height={40}
                     className="h-6 object-contain inline-block mr-2"
                     url={efficon}
                  />
                  {name}
               </div>
               <div className="text-xs text-white pb-1 mb-1 border-b border-slate-500">
                  {desc}
               </div>

               {/* Unlock Materials */}
               <div className="">
                  {allmats?.map((mat, key) => (
                     <MaterialQtyFrame
                        materialqty={mat}
                        key={"node_mat_" + key}
                     />
                  ))}
               </div>
            </div>
         );
      };

      return (
         <>
            <div dangerouslySetInnerHTML={{ __html: canvas_style }}></div>
            <div className="text-center">
               <div
                  className="canvas-board"
                  onClick={() => setSelectedNode("")}
               >
                  {classnodes?.map((node: any) => {
                     const nid = node?.id;
                     const nicon = node?.icon?.url;
                     const posx = node?.posx_left;
                     const posy = node?.posy_top;
                     return (
                        <div
                           key={"node-" + nid}
                           className={`absolute h-7 w-7 rounded-md bg-contain bg-no-repeat bg-center hover:drop-shadow-[0_0_6px_rgb(255,255,255)]`}
                           style={{
                              top: `${posy}px`,
                              left: `${posx}px`,
                              backgroundImage: `url('${nicon}')`,
                           }}
                           onClick={(e) => {
                              setSelectedNode(nid);
                              e.stopPropagation();
                           }}
                        ></div>
                     );
                  })}

                  {/* Dialogue box for selected node */}
                  {selectedNode != "" ? <InfoPopup /> : null}
               </div>
            </div>
         </>
      );
   };

   const ClassTotal = () => {
      const classnodes = csnodes
         .filter((csn: any) => csn.class_score_board?.id == selectedClass)
         .sort((a, b) => parseInt(a.node) - parseInt(b.node));

      const matData = classnodes?.map((cn) => cn.unlock_materials)?.flat();
      const buffData = classnodes
         ?.map((cn) =>
            cn.effect_list?.map((eff) => {
               return {
                  materials: [
                     {
                        material: {
                           id: eff.effect?.id,
                           name: eff.effect?.name,
                           icon: {
                              url: eff.effect?.icon?.url,
                           },
                        },
                        qty: eff.value_single,
                     },
                  ],
               };
            }),
         )
         ?.flat();

      let ascensionTotal = CalculateTotals(matData);
      let ascensionQP = matData
         .map((a) => a.qp_cost)
         .reduce((ps, a) => ps + a, 0);

      const qpmat = {
         material: {
            id: "4861",
            name: "QP",
            slug: "qp",
            icon: { url: "https://static.mana.wiki/grandorder/Qp.png" },
         },
         qty: ascensionQP,
      };

      const totalmats = [qpmat, ...ascensionTotal];
      const totalbuffs = CalculateTotals(buffData)?.sort(
         (a, b) => b.qty - a.qty,
      );
      console.log(totalbuffs);
      return (
         <>
            <table className="w-full">
               <thead></thead>
               <tbody>
                  <tr>
                     <td className="bg-[#2F2478] text-center text-[#DDEBF7] px-2 py-1 border border-color-sub">
                        Total Mats
                     </td>
                     <td className="px-2 py-1 border border-color-sub">
                        {totalmats?.map((mat, key) => (
                           <MaterialQtyFrame
                              materialqty={mat}
                              key={"node_mat_" + key}
                           />
                        ))}
                     </td>
                  </tr>
                  <tr>
                     <td className="bg-[#2F2478] text-center text-[#DDEBF7] px-2 py-1 border border-color-sub">
                        Total Buffs
                     </td>
                     <td className="px-2 py-1 border border-color-sub">
                        {totalbuffs?.map((mat, key) => (
                           <BuffFrame
                              materialqty={mat}
                              key={"node_buff_" + key}
                           />
                        ))}
                     </td>
                  </tr>
               </tbody>
            </table>

            <table className="w-full">
               <thead></thead>
               <tbody></tbody>
            </table>
         </>
      );
   };

   return (
      <>
         <CustomPageHeader
            name="Class Score Board"
            iconUrl="https://static.mana.wiki/grandorder/50Bg_SandOfStarlight.png"
         />
         <div className="relative z-20 mx-auto max-w-[728px] justify-center max-tablet:px-3 tablet:pb-36">
            <ClassSelection />

            <ClassScoreBoard />
            <ClassTotal />
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

const MaterialQtyFrame = ({ materialqty }: any) => {
   const mat = materialqty?.material;
   const qty = materialqty?.qty;
   var dispqty = qty;

   if (qty >= 1000000) {
      dispqty = Math.round(qty / 100000) / 10 + "M";
   } else if (qty >= 1000) {
      dispqty = Math.round(qty / 100) / 10 + "k";
   }

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
                  {dispqty}
               </div>
            </a>
         </div>
      </>
   );
};

const BuffFrame = ({ materialqty }: any) => {
   const mat = materialqty?.material;
   const qty = materialqty?.qty;
   var dispqty = qty + "%";

   return (
      <>
         <Tooltip key={mat?.id} placement="top">
            <TooltipTrigger className="relative inline-block text-center mr-0.5 mb-1">
               <div className="relative inline-block h-8 w-8 align-middle text-xs">
                  <img
                     src={mat?.icon?.url ?? "no_image_42df124128"}
                     className={`object-contain h-8`}
                     alt={mat?.name}
                     loading="lazy"
                  />
               </div>
               <div className="text-xs text-white bg-zinc-900 bg-opacity-80 px-1 mt-1 rounded-sm">
                  {dispqty}
               </div>
            </TooltipTrigger>
            <TooltipContent>{mat?.name}</TooltipContent>
         </Tooltip>
      </>
   );
};

export default ClassScore;

const ClassScoreBoardsQuery = `
   query {
      _classScoreBoards(limit: 10, sort:"sort") {
         docs {
            id
            name
            icon {
               url
            }
           image_board { url }
         }
      }
      _classScoreNodes(limit: 800) {
         docs {
            id
            name
            node
            
            posx_left
            posy_top
            desc
            icon { url }
            class_score_board { id }
            effect_list {
               effect {
                  id
                  name
                  icon { url }
               }
               value_single
               value_type
            }
            unlock_materials {
               qp_cost
               materials {
                  material {
                     id
                     name
                     slug
                     icon { url }
                  }
                  qty
               }
            }
         }
      }
   }
`;
