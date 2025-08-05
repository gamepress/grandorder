import { useEffect, useState, useRef } from "react";

import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { z } from "zod";
import { zx } from "zodix";

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
import { AdUnit } from "~/routes/_site+/_components/RampUnit";
import { fetchWithCache } from "~/utils/cache.server";

import {
   FeaturedEssenceRow,
   FeaturedServantRow,
   PullResultDiv,
   SummonNavigation,
} from "./_site.summon-simulator";

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
            ?.find((p: any) => p.id == "11")
            ?.servants?.map((a: any) => a.id.toString()),
         // Story Locked Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "12")
            ?.servants?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   var servants = await fetchGQL(ServantQuery, { servantIdList: servantids });

   // Craft Essences: Defaults to Story Summon - General Pool
   var ceids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "11")
            ?.craft_essences?.map((a: any) => a.id.toString()),
         // Story Locked Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "12")
            ?.craft_essences?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   var craft_essences = await fetchGQL(CraftEssenceQuery, { ceIdList: ceids });

   const summonEventData = await fetchGQL(SummonEventQuery, {
      simid: parseFloat(simid),
   });
   const summonEvent = summonEventData?.SummonEvents?.docs[0];

   if (!simid || !summonEvent)
      return json({
         simid: null,
         summonEventList: summonEventList?.SummonEvents?.docs,
         servants: servants?.Servants?.docs,
         craft_essences: craft_essences?.CraftEssences?.docs,
         general_servants: servants?.Servants?.docs,
         general_craft_essences: craft_essences?.CraftEssences?.docs,
         errorMessage: "",
      });

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
            ?.find((p: any) => p.id == "11")
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
            ?.find((p: any) => p.id == "11")
            ?.servants?.map((a: any) => a.id.toString()),
      ]),
   ] as string[];

   // Craft Essences: Defaults to Story Summon - General Pool
   var ceids = [
      ...new Set([
         // General Pool
         ...summonPools?._simulatorPools?.docs
            ?.find((p: any) => p.id == "11")
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
            ?.find((p: any) => p.id == "11")
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
         title: "Summon Simulator (JP) | Fate/Grand Order Wiki - GamePress",
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

   var banner_data = loaderdata.summonEvent;
   var banner_function = getSelectFunction(banner_data?.info); // will be undefined if not applicable
   var banner_options = getSelectOptions(banner_data?.info); // will be empty [] if not applicable, otherwise this is a list of rotating banners and featured Servants/Essences by name, format: // { "label": optionlabel, "value": [ arrayofnames, includes CEs ] }
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
      setPity330(bannerpity330);
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

   // ===========================

   function simChanged(selectbox) {
      navigate(`/jp-summon-simulator?simid=${selectbox}`);
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
            if (num != 11) num++;
            pulledBonus = true;
         }
      }
      for (var i = 0; i < num; i++) {
         var rarityNum = Math.floor(Math.random() * 100) + 1;
         // NOTE: You cannot just use setXXX(XXX + 1), you MUST use function call (XXX) => XXX+1
         // Additionally, since useState calls are asynchronous, a separate internal variable must be used to track pity progress within the for loop.
         var pitypull;
         if (i == 0) pitypull = pullct;
         pitypull = (pitypull ?? 0) + 1;
         setPullct((pullct) => pullct + 1);
         if (pitypull > 329 && pity330) {
            // Pity at 330 pulls.
            pitypull = 0;
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

      const currFiveStars =
         banner_data?.base_servant_override_5?.length > 0
            ? loaderdata?.servants?.filter(
                 // @ts-ignore
                 (s) =>
                    s.rarity?.name == 5 &&
                    banner_data?.base_servant_override_5?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_servants?.filter(
                 // @ts-ignore
                 (s) => s.rarity?.name == 5,
              );
      const currFourStars =
         banner_data?.base_servant_override_4?.length > 0
            ? loaderdata?.servants?.filter(
                 // @ts-ignore
                 (s) =>
                    s.rarity?.name == 4 &&
                    banner_data?.base_servant_override_4?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_servants?.filter(
                 // @ts-ignore
                 (s) => s.rarity?.name == 4,
              );
      const currThreeStars =
         banner_data?.base_servant_override_3?.length > 0
            ? loaderdata?.servants?.filter(
                 // @ts-ignore
                 (s) =>
                    s.rarity?.name == 3 &&
                    banner_data?.base_servant_override_3?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_servants?.filter(
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

      const currFiveStarEss =
         featuredOnly && fEssences?.length > 0
            ? fEssences
            : banner_data?.base_ce_override_5?.length > 0
            ? loaderdata?.craft_essences?.filter(
                 // @ts-ignore
                 (s) =>
                    banner_data?.base_ce_override_5?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_craft_essences?.filter(
                 // @ts-ignore
                 (s) => s.rarity?.name == 5,
              );

      const currFourStarEss =
         featuredOnly && fEssences?.length > 0
            ? fEssences
            : banner_data?.base_ce_override_4?.length > 0
            ? loaderdata?.craft_essences?.filter(
                 // @ts-ignore
                 (s) =>
                    banner_data?.base_ce_override_4?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_craft_essences?.filter(
                 // @ts-ignore
                 (s) => s.rarity?.name == 4,
              );

      const currThreeStarEss =
         featuredOnly && fEssences?.length > 0
            ? fEssences
            : banner_data?.base_ce_override_3?.length > 0
            ? loaderdata?.craft_essences?.filter(
                 // @ts-ignore
                 (s) =>
                    banner_data?.base_ce_override_3?.find(
                       // @ts-ignore
                       (so) => so.id == s.id,
                    ),
              )
            : loaderdata?.general_craft_essences?.filter(
                 // @ts-ignore
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
      setPullResults([]);
      setQuartzSpent(0);
      setTickets(0);
      setPullct(0);
   }

   const SimulatorDropDownBox = () => {
      return (
         <Select
            id="sim-select"
            onChange={(e) => simChanged(e.target.value)}
            value={banner_data?.sim_number ?? ""}
         >
            <option value="">Story</option>
            {/* Load banner list */}
            {banner_list_na?.map((banner: any) => {
               return (
                  <option
                     key={"banner_" + banner?.sim_number}
                     value={banner?.sim_number}
                  >
                     {banner?.title}
                  </option>
               );
            })}
         </Select>
      );
   };

   const SummonBannerInfo = () => {
      const selectRef = useRef(null);

      useEffect(() => {
         // Focus without scrolling
         if (selectRef.current) {
            selectRef.current.focus({ preventScroll: true });
         }
      }, []);

      return (
         <>
            <div className="p-3 flex items-center justify-center bg-2-sub border border-color-sub rounded-lg mt-3 shadow-sm shadow-1">
               <Image
                  height={300}
                  className="rounded-md h-60"
                  id="banner-img"
                  url={banner_image}
               />
            </div>
            {/* If daily featured Servants present */}
            {banner_data?.info ? (
               <>
                  <div
                     className="border border-color-sub p-3 rounded-lg mt-3 bg-2-sub"
                     dangerouslySetInnerHTML={{ __html: banner_info_display }}
                  ></div>
                  {/* If select options exist, create the select box */}
                  {banner_options?.length > 0 ? (
                     <>
                        <Select
                           ref={selectRef} // autoFocus
                           id="banner-rotation-select"
                           className="mt-3"
                           onChange={(e) =>
                              toggleOptions(e.target.value, banner_function)
                           }
                           value={rotatingBanner?.toString()}
                        >
                           {banner_options.map((bopt, index) => {
                              return (
                                 <option key={bopt.value} value={bopt.value}>
                                    {bopt.label}
                                 </option>
                              );
                           })}
                        </Select>
                     </>
                  ) : null}
               </>
            ) : null}

            <div id="summon-info">
               <div id="summon-blurb"></div>
               <div id="featured-lists">
                  {fServants?.length > 0 ? (
                     <>
                        <H2>Featured Servants</H2>
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
                        <H2>Featured Essences</H2>
                        <div className="grid grid-cols-3 gap-2">
                           {fEssences.map((ce, index) => (
                              <FeaturedEssenceRow
                                 data={ce}
                                 key={"fessence_" + index}
                              />
                           ))}
                        </div>
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
            <div className="flex items-center gap-3 py-3">
               <Button
                  className="!text-base flex-grow shadow-sm shadow-1"
                  color={summonType == "10" ? "zinc" : "light"}
                  id="summon-10-switch"
                  onClick={() => setSummonType("10")}
               >
                  10-Pull{pullEleven ? " (+1)" : ""}
               </Button>
               <Button
                  className="!text-base flex-grow shadow-sm shadow-1"
                  color={summonType == "single" ? "zinc" : "light"}
                  id="summon-single-switch"
                  onClick={() => setSummonType("single")}
               >
                  Summon Tickets
               </Button>
            </div>
            {summonType == "single" ? (
               <>
                  <div id="summon-single-div" className="w-full my-2">
                     <Table grid framed dense>
                        <TableHead>
                           <TableRow>
                              <TableHeader colSpan={10}>
                                 <span className="pr-2">Summon Tickets</span>
                                 <Badge color="blue">{ticketCount}</Badge>
                              </TableHeader>
                           </TableRow>
                        </TableHead>
                        <TableBody>
                           <TableRow>
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((t) => (
                                 <TableCell
                                    center
                                    key={`tickets-${t}`}
                                    onClick={() => setTicketCount(t)}
                                 >
                                    <input
                                       type="radio"
                                       name="tickets"
                                       id={`tickets-${t}`}
                                       checked={t === ticketCount}
                                       readOnly
                                    />
                                 </TableCell>
                              ))}
                           </TableRow>
                           <TableRow>
                              <TableCell id="double-summon-cell" colSpan={10}>
                                 Double Summon in{" "}
                                 <b>
                                    <span id="double-summon-counter">
                                       <Badge color="violet">
                                          {" "}
                                          {10 - (tickets % 10)}
                                       </Badge>
                                    </span>
                                 </b>{" "}
                                 tickets
                              </TableCell>
                           </TableRow>
                        </TableBody>
                     </Table>
                     <Button
                        color="green"
                        className="w-full mt-3 !text-base"
                        id="summon-button-singles"
                        onClick={() => simulateSingle()}
                     >
                        SUMMON
                     </Button>
                     <Button
                        outline
                        className="w-full mt-3 !text-base !text-1 shadow-sm shadow-1"
                        onClick={() => reset()}
                     >
                        <Icon name="refresh-ccw" size={14} />
                        Reset
                     </Button>
                  </div>
               </>
            ) : (
               <div id="summon-10-div">
                  <Button
                     id="summon-button"
                     color="green"
                     className="w-full !text-base"
                     onClick={() => simulate(10, false)}
                  >
                     SUMMON
                  </Button>
                  <Button
                     outline
                     className="w-full mt-3 !text-base !text-1 shadow-sm shadow-1"
                     onClick={() => reset()}
                  >
                     <Icon name="refresh-ccw" size={14} />
                     Reset
                  </Button>
               </div>
            )}
         </>
      );
   };

   const StatisticsTable = () => {
      return (
         <Table grid framed id="quartz-table" className="mt-4">
            <TableBody>
               <TableRow>
                  <TableHeader className="w-1/4" center>
                     Quartz Used
                  </TableHeader>
                  <TableHeader className="w-1/4" center>
                     $ Spent
                  </TableHeader>
                  <TableHeader className="w-1/4" center>
                     Tickets Used
                  </TableHeader>
                  <TableHeader className="w-1/4" center>
                     Pity Counter (/330)
                  </TableHeader>
               </TableRow>
               <TableRow>
                  <TableCell id="quartz" center>
                     {quartzSpent}
                  </TableCell>
                  <TableCell id="money" center>
                     ${(quartzSpent * 0.4790419).toFixed(2)}
                  </TableCell>
                  <TableCell id="tickets" center>
                     0
                  </TableCell>
                  <TableCell id="totalpull" center>
                     {pullct}
                  </TableCell>
               </TableRow>
            </TableBody>
         </Table>
      );
   };

   const NotableResults = () => {
      return (
         <div className="grid laptop:grid-cols-2 gap-3">
            {notableResults.length > 0 && (
               <div className="pulls-parent">
                  <H3>Notable Servants</H3>
                  <div
                     id="servants5"
                     className="rare-pulls-list divide-y divide-color-sub border border-color-sub shadow-sm shadow-1 rounded-md bg-3-sub"
                  >
                     {notableResults
                        .filter((res) => res.summon_availability)
                        ?.filter((v, i, a) => a.indexOf(v) == i)
                        ?.sort(
                           (a, b) =>
                              parseInt(b.rarity.name) - parseInt(a.rarity.name),
                        )
                        ?.map((s) => (
                           <TextLink
                              className="py-2 px-3 flex items-center justify-between text-sm"
                              key={s.id}
                              href={`/c/servants/${s.slug}`}
                           >
                              <span>
                                 {s.rarity.name}★ {s.name}
                              </span>
                              <span className="text-1">
                                 x
                                 {
                                    notableResults.filter((res) => res == s)
                                       ?.length
                                 }
                              </span>
                           </TextLink>
                        ))}
                  </div>
               </div>
            )}
            {notableResults.length > 0 && (
               <div className="pulls-parent">
                  <H3>5★ Craft Essences</H3>
                  <div
                     id="essences5"
                     className="rare-pulls-list divide-y divide-color-sub border border-color-sub shadow-sm shadow-1 rounded-md bg-3-sub"
                  >
                     {notableResults
                        .filter((res) => !res.summon_availability)
                        ?.filter((v, i, a) => a.indexOf(v) == i)
                        ?.map((ce) => (
                           <TextLink
                              className="py-2 px-3 flex items-center justify-between text-sm"
                              key={ce.id}
                              href={`/c/craft-essences/${ce.slug}`}
                           >
                              <span>{ce.name}</span>
                              <span className="text-1">
                                 x
                                 {
                                    notableResults.filter((res) => res == ce)
                                       ?.length
                                 }
                              </span>
                           </TextLink>
                        ))}
                  </div>
               </div>
            )}
         </div>
      );
   };

   return (
      <>
         <CustomPageHeader
            name="Summon Simulator (JP)"
            iconUrl="https://static.mana.wiki/summon-sim-japan.png"
         />
         <div className="relative z-20 mx-auto max-w-[728px] justify-center max-tablet:px-3 tablet:pb-36">
            <SummonNavigation />
            <div className="space-y-4 pb-4">
               <Text>
                  Both JP and NA Summon Simulators have a 0.8% rate for Rate-up
                  SSR Servants and 11 pulls (1 free pull every 30 SQ or every 10
                  tickets).
               </Text>
               <Text>
                  The JP Sim now has a Pity system, guaranteeing the rate-up SSR
                  Servant at 330 pulls (30x 11-pulls) starting with the New
                  Year's 2022 (JP) banner. Note, however, this pity does NOT
                  carry across rotating banners.
               </Text>
            </div>
            <AdUnit
               enableAds={true}
               adType={{
                  desktop: "leaderboard_atf",
                  tablet: "leaderboard_atf",
                  mobile: "med_rect_atf",
               }}
               className="my-8 mx-auto flex items-center justify-center"
               selectorId="summonSimJPDesktopLeaderATF"
            />
            <H2>Select a Banner</H2>
            {/* Show banner selection, defaults to Story Summon if unselected. */}
            <div id="to-load" className="block">
               <SimulatorDropDownBox />
               <SummonBannerInfo />

               <div className="h-1 w-full rounded-full bg-zinc-200 dark:bg-dark500 mt-8 mb-1" />
               <SummonButtonSelector />
               {/* Summon Results */}
               {pullResults?.length > 0 && (
                  <div
                     id="results"
                     className="text-center grid grid-cols-2 tablet:grid-cols-3 gap-2 pt-3"
                  >
                     {pullResults?.map((pr) => (
                        <PullResultDiv key={pr} data={pr} />
                     ))}
                  </div>
               )}
               <StatisticsTable />
               <NotableResults />
            </div>
         </div>
      </>
   );
};

export default SummonSimulator;

const SummonEventListQuery = `
query{
  SummonEvents(limit:1000, sort:"-sim_number", where:{available_in_jp:{equals:true}}) {
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
