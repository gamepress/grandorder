// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import type { MysticCode as MysticCodeType } from "~/db/payload-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { MysticCodesMain } from "./components/MysticCodes.Main";
import { MysticCodesSkills } from "./components/MysticCodes.Skills";
import { MysticCodesOverview } from "./components/MysticCodes.Overview";
import { MysticCodesExp } from "./components/MysticCodes.Exp";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const { entry } = await fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });
   return json({
      entry,
   });
}

const SECTIONS = {
   main: MysticCodesMain,
   skills: MysticCodesSkills,
   overview: MysticCodesOverview,
   exp: MysticCodesExp,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const mc = entry?.data?.MysticCode as MysticCodeType;
   //console.log(mc);

   return <Entry customComponents={SECTIONS} customData={mc} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      MysticCode(id: $entryId) {
         id
         name
         slug
         icon {
            url
         }
         image_male {
            url
         }
         skills {
            name
            cooldown
            effect
            effect_values
            skill_image {
               icon {
                  url
               }
            }
         }
         level_exp
         overview
      }
   }
`;
