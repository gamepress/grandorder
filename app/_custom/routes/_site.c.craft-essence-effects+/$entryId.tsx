// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { CraftEssenceEffectsMain } from "./components/CraftEssenceEffects.Main";
import { CraftEssenceEffectsCodes } from "./components/CraftEssenceEffects.Codes";

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
      effect: entry?.data?.CraftEssenceEffect,
   });
}

const SECTIONS = {
   main: CraftEssenceEffectsMain,
   codes: CraftEssenceEffectsCodes,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const { entry } = loaderdata; // 10696

   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      CraftEssenceEffect(id: $entryId) {
         id
         name
         slug
         icon {
            url
         }
         ce_With_Effect {
            id
            name
            slug
            cost
            icon {
               url
            }
            library_number
            _rarity {
               id
               name
               icon_frame {
                  url
               }
            }
            max_atk
            max_hp
            effect_list {
               effect {
                  id
               }
               value
               value_mlb
               value_type
               turns
               times
               activation_chance
               condition_notes
            }
         }
         cc_With_Effect {
            id
            name
            slug
            icon {
               url
            }
            command_code_id
            rarity {
               id
               name
            }
            effect_list {
               effect {
                  id
               }
               value
               value_type
               cooldown
               turns
               times
               condition_notes
            }
         }
      }
   }
`;
