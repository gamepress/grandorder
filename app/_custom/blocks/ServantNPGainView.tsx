import { gql, request as gqlRequest } from "graphql-request";
import { Image } from "~/components/Image";

import useSWR from "swr";

import { Loading } from "~/components/Loading";

type Props = {
   refId: String;
};

export const ServantNPGainView = ({ refId }: Props) => {
   const servantid = refId;

   if (!servantid) return null;

   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Servant(id: "${servantid}") {
               id
               name
               num_hits_quick
               num_hits_arts
               num_hits_buster
               num_hits_extra
               star_generation_rate
               star_absorption
               instant_death_chance
               np_charge_per_hit
               np_charge_when_attacked
               np_per_hit_quick
               np_per_hit_arts
               np_per_hit_buster
               np_per_hit_extra
               np_per_hit_np
               slug
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
         <TableNPGainPerCard data={servant} />
         <TableNPGainStar data={servant} />
      </div>
   );
};

function TableNPGainPerCard({ data: servant }: { data: any }) {
   const table_format = "w-full";
   const th_format =
      "bg-blue-500 bg-opacity-10 text-blue-900 dark:text-blue-100 font-bold text-xs px-1 border border-color-sub";

   const td_format = "px-1 border border-color-sub text-xs text-center";

   console.log(servant);

   const hitcounts = [
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Quick.png",
         hits: servant?.num_hits_quick,
         np: servant?.np_per_hit_quick,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Arts.png",
         hits: servant?.num_hits_arts,
         np: servant?.np_per_hit_arts,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Buster.png",
         hits: servant?.num_hits_buster,
         np: servant?.np_per_hit_buster,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGOCommandCardIcon_Extra.png",
         hits: servant?.num_hits_extra,
         np: servant?.np_per_hit_extra,
      },
      {
         img: "https://static.mana.wiki/grandorder/FGObufficon_303_NPGainUp.png",
         hits: servant?.noble_phantasm_base?.hit_count,
         np: servant?.np_per_hit_np,
      },
   ];
   return (
      <>
         <div className="mb-1">
            <table className={table_format}>
               <thead>
                  <tr>
                     <th className={th_format}>Card Hits</th>
                     {hitcounts.map((hit: any, i: any) => (
                        <th
                           key={servant.id + "_hitcount_" + i}
                           className={th_format}
                        >
                           <div className="text-xs font-bold inline-block align-middle mx-2">
                              {hit.hits ?? "-"}
                           </div>
                           <div className="h-auto w-6 inline-block align-middle">
                              <Image
                                 height={64}
                                 url={hit.img}
                                 alt="CardType"
                                 loading="lazy"
                              />
                           </div>
                        </th>
                     ))}
                  </tr>
                  <tr>
                     <th className={th_format}>Per Hit</th>
                     {hitcounts.map((hit: any, i: any) => (
                        <td
                           className={`${td_format} h-6`}
                           key={servant.id + "_npgain_" + i}
                        >
                           <div>{hit.np ?? servant?.np_charge_per_hit}%</div>
                        </td>
                     ))}
                  </tr>
               </thead>
               <tbody></tbody>
            </table>
         </div>
      </>
   );
}

function TableNPGainStar({ data: servant }: { data: any }) {
   // NP Gain is handled separately.
   const np_gain = servant.np_charge_per_hit; // FGObufficon_303_NPGainUp.png
   const others = [
      {
         icon: "https://static.mana.wiki/grandorder/FGObufficon_335_NPDamageGainUp.png",
         label: "NP when Attacked (%)",
         value: servant.np_charge_when_attacked,
      },
      {
         icon: "https://static.mana.wiki/grandorder/FGObufficon_325_StarGatherRateUp.png",
         label: "Star Absorption",
         value: servant.star_absorption,
      },
      {
         icon: "https://static.mana.wiki/grandorder/FGObufficon_321_StarDropRateUp.png",
         label: "Star Generation per Hit",
         value: servant.star_generation_rate,
      },
   ];

   return (
      <>
         <div
            className="border border-color-sub divide-y divide-color-sub shadow-sm shadow-1 rounded-lg 
               mb-3 [&>*:nth-of-type(odd)]:bg-zinc-50 dark:[&>*:nth-of-type(odd)]:bg-dark350 overflow-hidden"
         >
            <div className="p-2 justify-between flex items-center gap-2">
               <div className="flex items-center gap-2">
                  <Image
                     className="size-5"
                     height={40}
                     url={
                        "https://static.mana.wiki/grandorder/FGObufficon_303_NPGainUp.png"
                     }
                     alt="NPGain"
                     loading="lazy"
                  />
                  <span className="text-sm font-semibold">NP Gain</span>
               </div>
               <div className="text-sm font-semibold">{np_gain}%</div>
            </div>
            {others?.map((row: any, int: number) => {
               return (
                  <div
                     key={int}
                     className="p-2 justify-between flex items-center gap-2"
                  >
                     <div className="flex items-center gap-2">
                        <Image
                           className="size-5"
                           height={40}
                           url={row.icon}
                           alt="NPGain"
                           loading="lazy"
                        />
                        <span className="font-semibold text-sm">
                           {row.label}
                        </span>
                     </div>
                     <div className="text-sm font-semibold">{row.value}%</div>
                  </div>
               );
            })}
         </div>
      </>
   );
}
