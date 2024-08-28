import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "~/components/Table";
import { fetchWithCache } from "~/utils/cache.server";

async function fetchGQL(query: string, variables?: Record<string, any>) {
   // @ts-ignore
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
   //console.log(data);

   return data;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
   const summonEventList = await fetchGQL(SummonEventListQuery);
   return json({
      summonEventList: summonEventList?.SummonEvents?.docs,
      errorMessage: "",
   });
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Summon Banner List - Fate/Grand Order",
      },
      {
         name: "description",
         content: "A new kind of wiki",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const SummonBannerList = (data: any) => {
   //need banners, weapons, characters
   const loaderdata = useLoaderData<typeof loader>();
   console.log(loaderdata);
   const bannerlist = loaderdata?.summonEventList;

   return (
      <>
         <div className="relative z-20 mx-auto max-w-[728px] justify-center px-3 pb-36 pt-24">
            <H2 text="Summon Banner List" />
            <BannerIntroduction />

            <Table grid framed>
               <TableHead>
                  <TableRow className="text-sm">
                     <TableHeader center>#</TableHeader>
                     <TableHeader>Banner</TableHeader>
                     <TableHeader>JP Period</TableHeader>
                     <TableHeader>NA Period</TableHeader>
                     <TableHeader>Servants (Single)</TableHeader>
                     <TableHeader>Servants (Shared)</TableHeader>
                  </TableRow>
               </TableHead>
               <TableBody>
                  {/* @ts-ignore */}
                  {bannerlist?.map((banner, index) => {
                     return (
                        <>
                           <TableRow className="text-sm" key={index}>
                              <TableCell center>{index + 1}</TableCell>
                              <TableCell>
                                 <Image
                                    height={50}
                                    className="object-contain"
                                    url={
                                       banner.icon?.url ?? "no_image_42df124128"
                                    }
                                    options="height=50"
                                    alt={"IMAGE"}
                                 />
                                 <div className="text-xs whitespace-pre-wrap">
                                    {banner.name}
                                 </div>
                              </TableCell>
                              <TableCell>
                                 <div>{banner.jp_start_date}</div>
                                 <div>{banner.jp_end_date}</div>
                              </TableCell>
                              <TableCell>
                                 <div>{banner.na_start_date}</div>
                                 <div>{banner.na_end_date}</div>
                              </TableCell>
                              <TableCell className="text-xs whitespace-pre-wrap">
                                 {banner.servant_profile_future_banner
                                    ?.filter(
                                       // @ts-ignore
                                       (s) => s.banner_reference == "single",
                                    )
                                    // @ts-ignore
                                    ?.map((s, si, sf) => (
                                       <span>
                                          <a
                                             className="text-blue-500"
                                             href={`/c/servants/${s.banner_servant?.id}`}
                                          >
                                             <span>
                                                {s.banner_servant?.name}
                                             </span>
                                          </a>
                                          <span>
                                             {si + 1 === sf.length ? "" : ", "}
                                          </span>
                                       </span>
                                    ))}
                              </TableCell>
                              <TableCell className="text-xs whitespace-pre-wrap">
                                 {banner.servant_profile_future_banner
                                    ?.filter(
                                       // @ts-ignore
                                       (s) => s.banner_reference == "shared",
                                    )
                                    // @ts-ignore
                                    ?.map((s, si, sf) => (
                                       <span>
                                          <a
                                             className="text-blue-500"
                                             href={`/c/servants/${s.banner_servant?.id}`}
                                          >
                                             <span>
                                                {s.banner_servant?.name}
                                             </span>
                                          </a>
                                          <span>
                                             {si + 1 === sf.length ? "" : ", "}
                                          </span>
                                       </span>
                                    ))}
                              </TableCell>
                           </TableRow>
                        </>
                     );
                  })}
               </TableBody>
            </Table>
         </div>
      </>
   );
};

const BannerIntroduction = () => {
   return (
      <div className="mb-6">
         <ul className="list-disc ml-6">
            <li>
               Below is a historical list of Summon Events and which Servants
               were / will be available from each banner.
               <ul className="list-disc ml-6">
                  <li>
                     <strong>Single</strong> - Servant is featured as the only
                     rate-up Servant of their rarity for at least one of the
                     days of the Summoning Campaign.
                  </li>
                  <li>
                     <strong>Shared</strong> - Servant is rate-up with at least
                     one other Servant with the same rarity at all times they
                     are available during the Summoning Campaign (rates of their
                     appearance are subsequently divided/lower as a result).
                  </li>
               </ul>
            </li>
         </ul>
      </div>
   );
};

export default SummonBannerList;

const SummonEventListQuery = `
query{
  SummonEvents(limit:1000, sort:"-sim_number") {
    docs{
      id
      name
      sim_number
      jp_start_date
      jp_end_date
      na_start_date
      na_end_date
      icon{
        url
      }
      servant_profile_future_banner {    
        banner_servant {
          id
          name
        }
        banner_reference
      }
    }
  }
}
`;
