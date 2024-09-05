import { useRef, useEffect, useState } from "react";

import { Disclosure, Combobox } from "@headlessui/react";
import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

import { H2 } from "~/components/Headers";
import { Image } from "~/components/Image";
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
   //console.log(data);

   return data;
}

export async function loader({ params, request }: LoaderFunctionArgs) {
   const { simid } = zx.parseQuery(request, {
      simid: z.string().optional(),
   });

   const [summonEventList, summonPools] = await Promise.all([
      fetchGQL(SummonEventListQuery),
      fetchGQL(SummonPoolQuery),
   ]);

   // Servants: Defaults to Story Summon - General Pool
   var servantids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.servants?.map((a: any) => a.id.toString()),
         // Story Locked Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "2")
            ?.servants?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   var servants = await fetchGQL(ServantQuery, { servantIdList: servantids });

   // Craft Essences: Defaults to Story Summon - General Pool
   var ceids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.craft_essences?.map((a: any) => a.id.toString()),
         // Story Locked Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "2")
            ?.craft_essences?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   var craft_essences = await fetchGQL(CraftEssenceQuery, { ceIdList: ceids });

   if (!simid)
      return json({
         simid: null,
         summonEventList: summonEventList?.SummonEvents?.docs,
         servants: servants?.Servants?.docs,
         craft_essences: craft_essences?.CraftEssences?.docs,
         general_servants: servants?.Servants?.docs,
         general_craft_essences: craft_essences?.CraftEssences?.docs,
         errorMessage: "",
      });

   const summonEventData = await fetchGQL(SummonEventQuery, {
      simid: parseFloat(simid),
   });
   const summonEvent = summonEventData?.SummonEvents?.docs[0];

   const allServantData = await fetchGQL(AllServantQuery);

   var banner_function = getSelectFunction(summonEvent?.info); // will be undefined if not applicable
   var banner_options = getSelectOptions(summonEvent?.info); // will be empty [] if not applicable, otherwise this is a list of rotating banners and featured Servants/Essences by name, format: // { "label": optionlabel, "value": [ arrayofnames, includes CEs ] }
   var featured_servant_names = banner_options
      ?.map((a) => a.value)
      ?.flat()
      ?.flat()
      ?.filter((v, i, a) => a.indexOf(v) === i);
   var featured_servant_ids =
      featured_servant_names
         ?.map((a) => allServantData.Servants.docs.find((s) => s.name == a)?.id)
         .filter((a) => a) ?? [];

   var servantids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.servants?.map((a: any) => a.id.toString()),
         // Featured
         ...summonEvent?.featured_servants?.map((a: any) => a.id.toString()),
         ...featured_servant_ids,
         // Servant Override 3
         ...summonEvent?.base_servant_override_3?.map((a: any) =>
            a.id.toString(),
         ),
         // Servant Override 4
         ...summonEvent?.base_servant_override_4?.map((a: any) =>
            a.id.toString(),
         ),
         // Servant Override 5
         ...summonEvent?.base_servant_override_5?.map((a: any) =>
            a.id.toString(),
         ),
         // MUST ADD way to look up Servant by Name from parsed list of options!
      ]),
   ] as string[];

   var generalservantids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.servants?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   // Craft Essences: Defaults to Story Summon - General Pool
   var ceids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.craft_essences?.map((a: any) => a.id.toString()),
         // Featured
         ...summonEvent?.featured_essences?.map((a: any) => a.id.toString()),
         // CE Override 3
         ...summonEvent?.base_ce_override_3?.map((a: any) => a.id.toString()),
         // CE Override 4
         ...summonEvent?.base_ce_override_4?.map((a: any) => a.id.toString()),
         // CE Override 5
         ...summonEvent?.base_ce_override_5?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   // Craft Essences: Defaults to Story Summon - General Pool
   var generalceids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "1")
            ?.craft_essences?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   var servants = await fetchGQL(ServantQuery, { servantIdList: servantids });
   var general_servants = await fetchGQL(ServantQuery, {
      servantIdList: generalservantids,
   });
   var craft_essences = await fetchGQL(CraftEssenceQuery, { ceIdList: ceids });
   var general_craft_essences = await fetchGQL(CraftEssenceQuery, {
      ceIdList: generalceids,
   });

   return json(
      {
         simid: simid,
         summonEventList: summonEventList.SummonEvents?.docs,
         summonEvent: summonEvent,
         servants: servants?.Servants?.docs,
         craft_essences: craft_essences?.CraftEssences?.docs,
         general_servants: general_servants?.Servants?.docs,
         general_craft_essences: general_craft_essences?.CraftEssences?.docs,
         errorMessage: null,
      },
      { headers: { "Cache-Control": "public, s-maxage=60" } },
   );
}

export const meta: MetaFunction = () => {
   return [
      {
         title: "Summon Simulator - Fate/Grand Order",
      },
      {
         name: "description",
         content: "A new kind of wiki",
      },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
   ];
};

const SummonSimulator = (data: any) => {
   //need banners, weapons, characters
   const loaderdata = useLoaderData<typeof loader>();
   let navigate = useNavigate();

   const banner_list_na = loaderdata?.summonEventList;

   // console.log(loaderdata);

   var banner_data = loaderdata.summonEvent;
   var banner_function = getSelectFunction(banner_data?.info); // will be undefined if not applicable
   var banner_options = getSelectOptions(banner_data?.info); // will be empty [] if not applicable, otherwise this is a list of rotating banners and featured Servants/Essences by name, format: // { "label": optionlabel, "value": [ arrayofnames, includes CEs ] }
   console.log(loaderdata);
   console.log(banner_options);
   var banner_info_display = getSelectDisplay(banner_data?.info);
   var bannerid = parseFloat(banner_data?.sim_number);
   var bannerpity330 = false;
   // Set banners with Pity System
   if (
      bannerid >= 1075 ||
      (bannerid == 1073 &&
         banner_data?.name !=
            "MELTY BLOOD: TYPE LUMINA Evo 2022 Selection Celebration Pickup Summon")
   ) {
      bannerpity330 = true;
   }

   // Use State Variables and various general variables
   // ===========================
   const [summonType, setSummonType] = useState("10");
   const [ticketCount, setTicketCount] = useState(1);
   const [pullEleven, setPullEleven] = useState(false);
   const [pity330, setPity330] = useState(bannerpity330);
   const [tickets, setTickets] = useState(0);
   const [quartzSpent, setQuartzSpent] = useState(0);
   const [pullct, setPullct] = useState(0); // Pity counter
   const [pullResults, setPullResults] = useState([]);
   const [notableResults, setNotableResults] = useState([]);
   const [fServants, setFServants] = useState([]);
   const [fEssences, setFEssences] = useState([]);
   const [rotatingBanner, setRotatingBanner] = useState(
      banner_options?.[0]?.value,
   );

   // Initialize Featured Servants / Essences each time a new banner is selected
   useEffect(() => {
      var init_featured_servants = banner_data?.featured_servants?.map((s) =>
         loaderdata?.servants?.find((a) => a.id == s.id),
      );
      var init_featured_essences = banner_data?.featured_essences?.map((c) =>
         loaderdata?.craft_essences?.find((a) => a.id == c.id),
      );

      if (banner_options?.length > 0) {
         init_featured_servants = banner_options[0]?.value
            ?.map((b) => {
               const sentry = loaderdata?.servants?.find((a) => a.name == b);
               if (!sentry) console.log("Could not find Servant: " + b);
               return sentry;
            })
            ?.filter((n) => n);

         init_featured_essences = banner_options[0]?.value
            ?.map((b) => loaderdata?.craft_essences?.find((a) => a.name == b))
            ?.filter((n) => n);

         setRotatingBanner(banner_options?.[0]?.value);
      }

      setPullEleven(
         (bannerid > 188 && bannerid != 1029 && bannerid != 1009) ||
            bannerid == 165 ||
            isNaN(bannerid)
            ? true
            : false,
      );
      setFServants(init_featured_servants);
      setFEssences(init_featured_essences);
   }, [loaderdata]);

   const is_guaranteed = banner_data?.guaranteed;
   const is_guaranteed4 = banner_data?.guaranteed4;
   const featuredOnly = banner_data?.featured_only;
   const featuredEssOnly = banner_data?.featured_ess_daily;
   const ce4only = bannerid == 1053 ? true : false;

   var featured5sChance = 0,
      featured4sChance = 0,
      featured3sChance = 100;
   var featured5eChance = 0,
      featured4eChance = 0,
      featured3eChance = 200;

   const rates4s = [0, 500, 800, 700, 933, 833, 900];
   const rates5s = [0, 800, 900, 900];

   const rates4e = [0, 333, 667, 750, 833];
   const rates5e = [0, 700, 600, 750, 875];

   const banner_image =
      banner_data?.icon?.url ??
      "https://static.mana.wiki/grandorder/fgo_simulator_story_banner.png"; // Defaults to Story Banner if no banner selected

   console.log(pity330);

   // ===========================

   function simChanged(selectbox) {
      navigate(`/summon-simulator?simid=${selectbox}`);
      setPullct(0);
   }
   function toggleOptions(rateups, type) {
      // Type should have two values:
      // - toggleRateUps
      // - toggleAllDaily
      setPullct(0);
      setRotatingBanner(rateups);

      var newRateups = rateups?.split(",");
      for (var i = 0; i < newRateups?.length; i++) {
         newRateups[i] = newRateups[i].replace(/%2C/g, ",");
         newRateups[i] = newRateups[i].replace(/%22C/g, '"');
      }

      // Set fServants if applicable
      const rateup_servants = newRateups
         ?.map((r) => loaderdata?.servants?.find((a) => a.name == r))
         ?.filter((n) => n);
      setFServants(rateup_servants);

      // Set fEssences if applicable
      const rateup_essences = newRateups
         ?.map((r) => loaderdata?.craft_essences?.find((a) => a.name == r))
         ?.filter((n) => n);
      setFEssences(rateup_essences);
   }
   function toggleRateUps(rateups) {
      setPullct(0);
   }
   function simulateSingle() {
      simulate(ticketCount, true);
   }
   function simulate(num, isTicket) {
      // Set 11-pull if a 10-pull is attempted on an 11-pull enabled banner
      if (num == 10 && pullEleven) {
         num = 11;
      }
      setPullResults([]);
      var pulledServant = false;
      var pulledHigh = false;
      var pulledBonus = false;
      if (isTicket && pullEleven) {
         var rem = tickets % 10;
         //every 10th ticket gives an extra pull
         if (rem + num >= 10) {
            num++;
            pulledBonus = true;
         }
      }
      var currPullCounter = pullct;
      for (var i = 0; i < num; i++) {
         var rarityNum = Math.floor(Math.random() * 100) + 1;
         // NOTE: You cannot just use setXXX(XXX + 1), you MUST use function call (XXX) => XXX+1
         setPullct((pullct) => pullct + 1);
         if (pullct > 329 && pity330) {
            // Pity at 330 pulls.
            pullServant("guaranteed");
            continue;
         }
         if (i == 10 && is_guaranteed) {
            pullServant("guaranteed");
            continue;
         }
         if (i == 9 && is_guaranteed4) {
            pullServant("guaranteed4");
            continue;
         }
         if (i == 8 && !pulledServant && !isTicket) {
            pullServant(3);
            continue;
         }
         if (i == 9 && !pulledHigh && !isTicket) {
            //4x higher chance to pull essence than servant
            var rand = Math.floor(Math.random() * 100) + 1;
            pullEssence(4);
            continue;
         }
         //pulled 3* servant
         if (rarityNum < 40) {
            pulledServant = true;
            pullServant(3);
         }
         //pulled 4* essence
         else if (rarityNum < 52) {
            pulledHigh = true;
            pullEssence(4);
         }
         //pulled 4* servant
         else if (rarityNum < 55) {
            pulledServant = true;
            pulledHigh = true;
            pullServant(4);
         }
         //pulled 5* servant
         else if (rarityNum < 56) {
            pulledServant = true;
            pulledHigh = true;
            pullServant(5);
         }
         //pulled 3* essence
         else if (rarityNum < 96) {
            if (ce4only) {
               pullServant(3);
            } else {
               pullEssence(3);
            }
         }
         //pulled 5* essence
         else {
            if (ce4only) {
               pullEssence(4);
            } else {
               pulledHigh = true;
               pullEssence(5);
            }
         }
      }

      // Update pull metrics
      if (isTicket) {
         setTickets((tickets) => tickets + num);
         if (pullEleven && pulledBonus) {
            setTickets((tickets) => tickets - 1);
         }
      } else {
         setQuartzSpent((quartzSpent) => quartzSpent + 30);
      }
   }

   function pullServant(stars) {
      var featuredChance = Math.floor(Math.random() * 1000);
      var pullFeatured = false;

      const currFeatured5S =
         fServants?.filter((s: any) => s.rarity?.name == 5) ?? [];
      const currFeatured4S =
         fServants?.filter((s: any) => s.rarity?.name == 4) ?? [];
      const currFeatured3S =
         fServants?.filter((s: any) => s.rarity?.name == 3) ?? [];

      // @ts-ignore
      featured5sChance =
         rates5s[Math.min(currFeatured5S?.length, rates5s.length - 1)];
      // @ts-ignore
      featured4sChance =
         rates4s[Math.min(currFeatured4S?.length, rates4s.length - 1)];

      const currFiveStars = loaderdata?.general_servants?.filter(
         // @ts-ignore
         (s) => s.rarity?.name == 5,
      );
      const currFourStars = loaderdata?.general_servants?.filter(
         // @ts-ignore
         (s) => s.rarity?.name == 4,
      );
      const currThreeStars = loaderdata?.general_servants?.filter(
         // @ts-ignore
         (s) => s.rarity?.name == 3,
      );

      // @ts-ignore
      var servant;

      if (stars == "guaranteed") {
         // Pull guaranteed Servant
         servant = pullFeaturedObj(true, currFeatured5S, currFeatured5S);
         // Added 12/31/2021 - If Pity is active for banner:
         // Reset pity counter to 0
         if (pity330) {
            setPullct(0);
         }
      } else if (stars == "guaranteed4") {
         // Pull guaranteed 4 star
         servant = pullFeaturedObj(true, currFeatured4S, currFourStars);
      } else if (stars == 3) {
         // Pull a 3 star, all the extra code was to format the result pull cell color based on availability, unneeded here.
         pullFeatured = checkFeatured(featuredChance, featured3sChance);
         if (featuredOnly && currFeatured3S.length > 0) {
            pullFeatured = true;
         }
         servant = pullFeaturedObj(
            pullFeatured,
            currFeatured3S,
            currThreeStars,
         );
      } else if (stars == 4) {
         // Pull a general 4 star with chance of featured 4 star if applicable
         pullFeatured = checkFeatured(featuredChance, featured4sChance);
         if (featuredOnly && currFeatured4S.length > 0) {
            pullFeatured = true;
         }
         servant = pullFeaturedObj(pullFeatured, currFeatured4S, currFourStars);
         setNotableResults((notableResults) => [...notableResults, servant]);
      } else {
         // Pull a 5 star with chance of featured 5 star if applicable
         pullFeatured = checkFeatured(featuredChance, featured5sChance);
         if (featuredOnly && currFeatured5S.length > 0) {
            pullFeatured = true;
         }
         servant = pullFeaturedObj(pullFeatured, currFeatured5S, currFiveStars);
         setNotableResults((notableResults) => [...notableResults, servant]);
         // Reset pity counter to 0 if the pulled Servant was featured.
         if (pity330 && currFeatured5S.indexOf(servant) > -1) {
            setPullct((pullct) => 0);
         }
      }

      setPullResults((pullResults) => [...pullResults, servant]);
   }

   function pullEssence(stars) {
      var featuredChance = Math.floor(Math.random() * 1000);
      var pullFeatured = false;

      const currFeatured5E = fEssences?.filter((s) => s.rarity?.name == 5);
      const currFeatured4E = fEssences?.filter((s) => s.rarity?.name == 4);
      const currFeatured3E = fEssences?.filter((s) => s.rarity?.name == 3);

      const currFiveStarEss = loaderdata?.general_craft_essences?.filter(
         (s) => s.rarity?.name == 5,
      );
      const currFourStarEss = loaderdata?.general_craft_essences?.filter(
         (s) => s.rarity?.name == 4,
      );
      const currThreeStarEss = loaderdata?.general_craft_essences?.filter(
         (s) => s.rarity?.name == 3,
      );

      var essence;

      if (stars == 3) {
         pullFeatured = checkFeatured(featuredChance, featured3eChance);
         if (featuredEssOnly) {
            pullFeatured = true;
         }
         essence = pullFeaturedObj(
            pullFeatured,
            currFeatured3E,
            currThreeStarEss,
         );
      } else if (stars == 4) {
         pullFeatured = checkFeatured(featuredChance, featured4eChance);
         if (featuredEssOnly) {
            pullFeatured = true;
         }
         essence = pullFeaturedObj(
            pullFeatured,
            currFeatured4E,
            currFourStarEss,
         );
      } else {
         pullFeatured = checkFeatured(featuredChance, featured5eChance);
         if (featuredEssOnly) {
            pullFeatured = true;
         }
         essence = pullFeaturedObj(
            pullFeatured,
            currFeatured5E,
            currFiveStarEss,
         );
         setNotableResults((notableResults) => [...notableResults, essence]);
      }

      setPullResults((pullResults) => [...pullResults, essence]);
   }

   function checkFeatured(roll, chance) {
      return roll < chance;
   }

   function pullFeaturedObj(featured, currFeatured, currs) {
      if (featured && currFeatured?.length > 0) {
         var idx = Math.floor(Math.random() * currFeatured.length);
         return currFeatured[idx];
      } else {
         var idx = Math.floor(Math.random() * currs.length);
         return currs[idx];
      }
   }

   function reset() {
      console.log("reset");
      return null;
   }

   const SummonSimIntroduction = () => {
      return (
         <div className="block">
            Note that banners starting from the 4th Anniversary (7/3/2021) and
            onward implement a free 11-pull every 10 rolls. Banners before then
            will not include the extra 11-pull.
            <br />
            <strong>
               The NA Sim now has a Pity system, guaranteeing the rate-up SSR
               Servant at 330 pulls (30x 11-pulls) starting with the Heian-kyo
               banner (11/21/2022). Note, however, this pity does NOT carry
               across rotating banners.
            </strong>
         </div>
      );
   };

   const SimulatorDropDownBox = () => {
      return (
         <select
            id="sim-select"
            className="w-full p-1 my-1 border border-color-sub bg-zinc-100 dark:bg-zinc-800"
            onChange={(e) => simChanged(e.target.value)}
            value={banner_data?.sim_number ?? ""}
         >
            <option value="">Story</option>
            {/* Load banner list */}
            {banner_list_na?.map((banner: any) => {
               return (
                  <option value={banner?.sim_number}>{banner?.title}</option>
               );
            })}
         </select>
      );
   };

   const SummonBannerInfo = () => {
      return (
         <>
            <div className="text-center">
               <img
                  className="rounded-md inline-block"
                  id="banner-img"
                  src={banner_image}
               />
            </div>
            {/* If daily featured Servants present */}
            {banner_data?.info ? (
               <>
                  <div
                     className="my-1"
                     dangerouslySetInnerHTML={{ __html: banner_info_display }}
                  ></div>
                  {/* If select options exist, create the select box */}
                  {banner_options?.length > 0 ? (
                     <>
                        <select
                           id="banner-rotation-select"
                           className="w-full p-1 my-1 dark:bg-zinc-800"
                           onChange={(e) =>
                              toggleOptions(e.target.value, banner_function)
                           }
                           value={rotatingBanner?.toString()}
                        >
                           {banner_options.map((bopt, index) => {
                              return (
                                 <option value={bopt.value}>
                                    {bopt.label}
                                 </option>
                              );
                           })}
                        </select>
                     </>
                  ) : null}
               </>
            ) : null}

            <div id="summon-info">
               <div id="summon-blurb"></div>
               <div id="featured-lists">
                  {fServants?.length > 0 ? (
                     <>
                        <H2 text="Featured Servants" />
                        {fServants.map((servant, index) => (
                           <FeaturedServantRow
                              data={servant}
                              key={"fservant_" + index}
                           />
                        ))}
                     </>
                  ) : null}

                  {fEssences?.length > 0 ? (
                     <>
                        <H2 text="Featured Essences" />
                        {fEssences.map((ce, index) => (
                           <FeaturedEssenceRow
                              data={ce}
                              key={"fessence_" + index}
                           />
                        ))}
                     </>
                  ) : null}
               </div>
            </div>
         </>
      );
   };

   const SummonButtonSelector = () => {
      return (
         <>
            <div className="clearfix w-full flex justify-between gap-2">
               <button
                  className={`my-1 p-2 text-center w-full bg-opacity-50 border-2 border-[#3076b2] ${
                     summonType == "10" ? "bg-blue-500 font-bold" : ""
                  }`}
                  id="summon-10-switch"
                  onClick={() => setSummonType("10")}
               >
                  10-Pull{pullEleven ? " (+1)" : ""}
               </button>
               <button
                  className={`my-1 p-2 text-center w-full bg-opacity-50 border-2 border-[#3076b2] ${
                     summonType == "single" ? "bg-blue-500 font-bold" : ""
                  }`}
                  id="summon-single-switch"
                  onClick={() => setSummonType("single")}
               >
                  Summon Tickets
               </button>
            </div>

            {summonType == "single" ? (
               <>
                  <div id="summon-single-div" className="w-full my-2">
                     <table className="w-full text-center border border-color-sub mb-1">
                        <thead>
                           <tr>
                              <th colSpan={10} className="p-1">
                                 Summon Tickets: {ticketCount}
                              </th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                                 <td
                                    className="border border-color-sub h-10"
                                    key={`tickets-${t}`}
                                    onClick={() => setTicketCount(t)}
                                 >
                                    <input
                                       type="radio"
                                       name="tickets"
                                       id={`tickets-${t}`}
                                       checked={t === ticketCount}
                                       readOnly
                                    ></input>
                                 </td>
                              ))}
                           </tr>
                           <tr>
                              <td
                                 id="double-summon-cell"
                                 colSpan={10}
                                 className="text-center p-1"
                              >
                                 Double Summon in:{" "}
                                 <b>
                                    <span id="double-summon-counter">
                                       {10 - (tickets % 10)}
                                    </span>
                                 </b>{" "}
                                 tickets
                              </td>
                           </tr>
                        </tbody>
                     </table>
                     <button
                        id="summon-button-singles"
                        onClick={() => simulateSingle()}
                        className="my-2 border w-full rounded-sm cursor-pointer p-2 font-bold border-[#3076b2] text-[#3076b2] hover:bg-[#3076b2] hover:text-white"
                     >
                        Summon
                     </button>
                  </div>
               </>
            ) : (
               <div id="summon-10-div">
                  <button
                     id="summon-button"
                     onClick={() => simulate(10, false)}
                     className="my-2 border w-full rounded-sm cursor-pointer p-2 font-bold border-[#3076b2] text-[#3076b2] hover:bg-[#3076b2] hover:text-white"
                  >
                     Summon
                  </button>
               </div>
            )}
         </>
      );
   };

   const SummonResults = () => {
      return (
         <div id="results" className="text-center grid grid-cols-2">
            {pullResults?.map((pr) => (
               <PullResultDiv data={pr} />
            ))}
         </div>
      );
   };

   const StatisticsTable = () => {
      return (
         <table id="quartz-table" className="w-full text-center my-2">
            <tbody>
               <tr>
                  <th className="border border-color-sub">Quartz Used:</th>

                  <th className="border border-color-sub">$ Spent:</th>

                  <th className="border border-color-sub">Tickets Used:</th>
                  <th className="border border-color-sub">
                     Pity Counter (/330):
                  </th>
               </tr>
               <tr>
                  <td className="border border-color-sub" id="quartz">
                     {quartzSpent}
                  </td>
                  <td className="border border-color-sub" id="money">
                     ${(quartzSpent * 0.4790419).toFixed(2)}
                  </td>
                  <td className="border border-color-sub" id="tickets">
                     0
                  </td>
                  <td className="border border-color-sub" id="totalpull">
                     {pullct}
                  </td>
               </tr>
            </tbody>
         </table>
      );
   };

   const ResetButton = () => {
      return (
         <button onClick={() => reset()} className="w-full">
            Reset
         </button>
      );
   };

   const NotableResults = () => {
      return (
         <div className="grid grid-cols-2">
            <div className="pulls-parent margin-right:2%;">
               <div className="font-bold text-lg border-b mb-1">
                  Notable Servants
               </div>
               <div id="servants5" className="rare-pulls-list">
                  {notableResults
                     .filter((res) => res.summon_availability)
                     ?.filter((v, i, a) => a.indexOf(v) == i)
                     ?.sort(
                        (a, b) =>
                           parseInt(b.rarity.name) - parseInt(a.rarity.name),
                     )
                     ?.map((s) => (
                        <a href={`/c/servants/${s.id}`}>
                           <div>
                              <span className="text-blue-500 mr-2">
                                 {s.rarity.name}★ {s.name}
                              </span>
                              x
                              {notableResults.filter((res) => res == s)?.length}
                           </div>
                        </a>
                     ))}
               </div>
            </div>
            <div className="pulls-parent">
               <div className="font-bold text-lg border-b mb-1">
                  5★ Craft Essences
               </div>
               <div id="essences5" className="rare-pulls-list">
                  {notableResults
                     .filter((res) => !res.summon_availability)
                     ?.filter((v, i, a) => a.indexOf(v) == i)
                     ?.map((ce) => (
                        <a href={`/c/craft-essences/${ce.id}`}>
                           <div>
                              <span className="text-blue-500 mr-2">
                                 {ce.name}
                              </span>
                              x
                              {
                                 notableResults.filter((res) => res == ce)
                                    ?.length
                              }
                           </div>
                        </a>
                     ))}
               </div>
            </div>
         </div>
      );
   };

   return (
      <>
         <div className="relative z-20 mx-auto max-w-[728px] justify-center px-3 pb-36 pt-24">
            <SummonSimIntroduction />
            {/* Show banner selection, defaults to Story Summon if unselected. */}

            <H2 text="NA Summon Simulator" />

            <div id="to-load" className="block">
               <SimulatorDropDownBox />
               <SummonBannerInfo />
               <SummonButtonSelector />
               <SummonResults />
               <StatisticsTable />
               <ResetButton />
               <NotableResults />
            </div>
         </div>
      </>
   );
};

function FeaturedServantRow({ data }: any) {
   const icon = data?.icon?.url;
   const url = data?.slug ?? data?.id;
   const name = data?.name;
   const star = data?.rarity?.icon?.url;
   const rarity = parseInt(data?.rarity?.name);

   return (
      <>
         <div className="border border-color-sub my-1 px-3 py-1 rounded-sm flex justify-between items-center">
            <div>
               <a href={`/c/servants/${url}`}>
                  <div className="inline-block align-middle">
                     <Image
                        options="aspect_ratio=1:1&height=45&width=45"
                        alt={name}
                        url={icon}
                        className="object-contain"
                     />
                  </div>
                  <div className="inline-block align-middle text-blue-400 ml-2">
                     {name}
                  </div>
               </a>
            </div>
            <div>
               {Array(rarity)
                  .fill(0)
                  .map((x) => (
                     <Image
                        options="aspect_ratio=1:1&height=16&width=16"
                        alt={rarity.toString()}
                        url={star}
                        className="object-contain inline-block"
                     />
                  ))}
            </div>
         </div>
      </>
   );
}

function FeaturedEssenceRow({ data }: any) {
   const icon = data?.icon?.url;
   const url = data?.slug ?? data?.id;
   const name = data?.name;
   const star = data?.rarity?.icon?.url;
   const rarity = parseInt(data?.rarity?.name);
   const frame = data?.rarity?.icon_frame?.url;

   return (
      <>
         <div className="border border-color-sub my-1 px-3 py-1 rounded-sm flex justify-between items-center">
            <div>
               <a href={`/c/craft-essences/${url}`}>
                  <div className="inline-flex align-middle items-top justify-center">
                     <Image
                        options="height=49&width=45"
                        alt={name}
                        url={frame}
                        className="object-contain z-10"
                     />
                     <Image
                        options="aspect_ratio=1:1&height=45&width=45"
                        alt={name}
                        url={icon}
                        className="object-contain rounded-t-md absolute"
                     />
                  </div>
                  <div className="inline-block align-middle text-blue-400 ml-2">
                     {name}
                  </div>
               </a>
            </div>
            <div>
               {Array(rarity)
                  .fill(0)
                  .map((x) => (
                     <Image
                        options="aspect_ratio=1:1&height=16&width=16"
                        alt={rarity.toString()}
                        url={star}
                        className="object-contain inline-block"
                     />
                  ))}
            </div>
         </div>
      </>
   );
}

function PullResultDiv({ data }: any) {
   const icon = data?.icon?.url;
   const url = data?.slug ?? data?.id;
   const name = data?.name;
   const star = data?.rarity?.icon?.url;
   const rarity = parseInt(data?.rarity?.name);
   const frame = data?.rarity?.icon_frame?.url;
   const type = frame ? "craft-essences" : "servants";
   const availability = data?.summon_availability?.name;
   var cellcolor = "";
   switch (availability) {
      case "Limited":
         if (rarity == 5) cellcolor = "bg-red-600 bg-opacity-90";
         if (rarity == 4) cellcolor = "bg-red-400 bg-opacity-30";
         break;
      case "Story-locked":
         if (rarity == 5) cellcolor = "bg-blue-600 bg-opacity-90";
         if (rarity == 4) cellcolor = "bg-blue-400 bg-opacity-30";
         break;
      default:
   }

   return (
      <>
         <div
            className={`border border-color-sub py-1 text-center leading-none ${
               cellcolor ?? ""
            }`}
         >
            <a href={`/c/${type}/${url}`}>
               <div>
                  <div className="inline-flex mb-1.5 h-[48px]">
                     {frame ? (
                        <Image
                           options="height=49&width=45"
                           alt={name}
                           url={frame}
                           className="object-contain z-10 absolute"
                        />
                     ) : null}

                     <Image
                        options=""
                        alt={name}
                        url={icon}
                        className="object-contain rounded-t-md w-[45px]"
                     />
                  </div>
               </div>
               <div className="text-blue-400 text-xs leading-none">{name}</div>
               <div>
                  {Array(rarity)
                     .fill(0)
                     .map((x) => (
                        <Image
                           options="aspect_ratio=1:1&height=8&width=8"
                           alt={rarity.toString()}
                           url={star}
                           className="object-contain inline-block"
                        />
                     ))}
               </div>
            </a>
         </div>
      </>
   );
}

export default SummonSimulator;

const SummonEventListQuery = `
query{
  SummonEvents(limit:1000, sort:"-sim_number", where:{available_in_na:{equals:true}}) {
    docs{
      id
      title:name
      sim_number
    }
  }
}
`;

// 1056086
const SummonEventQuery = `
   query($simid:Float) {
      SummonEvents(where:{sim_number:{equals:$simid}}) {
       docs{
        id
        title:name
        sim_number
                icon { url }
        info:summon_info
        featured_servants { id }
        featured_essences { id }

        base_servant_override_3 { id }
        base_servant_override_4 { id }
        base_servant_override_5 { id }
        base_ce_override_3 { id }
        base_ce_override_4 { id }
        base_ce_override_5 { id }
        
        featured_only
        featured_ess_daily
        guaranteed:is_guaranteed
        guaranteed4:is_4star_guaranteed
        
        na:available_in_na
        jp:available_in_jp
       }
      }
    }
`;

const SummonPoolQuery = `
query {
  _simulatorPools {
    docs{
      id
      name
      servants { id }
      craft_essences { id }
    }
  }
}
`;

const AllServantQuery = `
query {
  Servants(limit: 2000) {
    docs {
      id
      name
    }
  }
}
`;

const ServantQuery = `
query ($servantIdList: [String]) {
  Servants(limit: 500, where: { id: { in: $servantIdList } }) {
    docs {
      id
      name
      slug
      icon{ url }
      rarity:star_rarity{ 
         name
         icon { url }
      }
      summon_availability { name }
    }
  }
}
`;

const CraftEssenceQuery = `
query ($ceIdList: [String]) {
  CraftEssences(limit: 500, where: { id: { in: $ceIdList } }) {
    docs {
      id
      name
      slug
      icon{ url }
      rarity:_rarity{ 
         name 
         icon { url }
         icon_frame { url }
      }
    }
  }
}
`;

// Parses any <select><option> HTML in the info text and returns relevant values
function getSelectFunction(info) {
   const text = info
      ?.replace(/[\r\n\t]/g, "")
      ?.split('onchange="')[1]
      ?.replace(/\(.*/, "");
   return text; // Return toggleRateUps or toggleAllDaily.
}

function getSelectOptions(info) {
   // { "label": optionlabel, "value": [ arrayofnames, includes CEs ] }

   const options = info
      ?.replace(/[\r\n\t]/g, "")
      ?.split("<option")
      ?.map((o) => o?.replace(/\<\/option\>/, ""))
      ?.slice(1);

   const obj = options?.map((o) => {
      return {
         label: o.replace("</select>", "")?.replace(/.*\>/, "")?.trim(),
         value: o
            .replace(/\"\>.*/, "")
            .replace(/.*\="/, "")
            .split(",")
            .map((l) => l.trim()),
      };
   });

   return obj; // Return object with list of options
}

function getSelectDisplay(info) {
   const text = info
      ?.replace(/[\r\n\t]/g, "")
      ?.replace(/\<select.*\<\/select\>/, "");
   return text;
}
