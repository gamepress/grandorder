// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { CraftEssencesEffect } from "~/_custom/routes/_site.c.craft-essences+/components/CraftEssences.Effect";
import { CraftEssencesMain } from "~/_custom/routes/_site.c.craft-essences+/components/CraftEssences.Main";
import { CraftEssencesSimilar } from "~/_custom/routes/_site.c.craft-essences+/components/CraftEssences.Similar";
import type { CraftEssence as CraftEssenceType } from "payload/generated-custom-types";
import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

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
   main: CraftEssencesMain,
   effect: CraftEssencesEffect,
   similar: CraftEssencesSimilar,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const ce = entry?.data?.CraftEssence as CraftEssenceType;

   return <Entry customComponents={SECTIONS} customData={ce} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      CraftEssence(id: $entryId) {
         id
         name
         library_number
         cost
         base_hp
         max_hp
         base_atk
         max_atk
         description
         description_limit_break
         description_flavor
         illustrator {
            id
            name
         }
         cv {
            id
            name
         }
         servant {
            name
            icon {
               url
            }
         }
         icon {
            url
         }
         image {
            url
         }
         _rarity {
            name
         }
         _ce_Type_Image {
            icon {
               url
            }
         }
         effect_list {
            effect {
               name
               icon {
                  url
               }
               ce_With_Effect {
                  id
                  slug
                  name
                  is_bond_ce
                  _rarity {
                     name
                  }
                  icon {
                     url
                  }
               }
            }
            bonus_item {
               id
               name
               icon {
                  url
               }
            }
         }
         release_date_jp
         release_date_na
      }
   }
`;
