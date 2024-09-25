// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { CommandCodesEffect } from "~/_custom/routes/_site.c.command-codes+/components/CommandCodes.Effect";
import { CommandCodesMain } from "~/_custom/routes/_site.c.command-codes+/components/CommandCodes.Main";
import { CommandCodesSimilar } from "~/_custom/routes/_site.c.command-codes+/components/CommandCodes.Similar";
import type { CommandCode as CommandCodeType } from "~/db/payload-custom-types";
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
   main: CommandCodesMain,
   effect: CommandCodesEffect,
   similar: CommandCodesSimilar,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const cc = entry?.data?.CommandCode as CommandCodeType;

   return <Entry customComponents={SECTIONS} customData={cc} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      CommandCode(id: $entryId) {
         id
         name
         command_code_id
         desc_effect
         acquisition_method
         illustrator {
            id
            name
         }
         icon {
            url
         }
         image {
            url
         }
         rarity {
            name
         }
         effect_image {
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
               cc_With_Effect {
                  id
                  slug
                  name
                  rarity {
                     name
                  }
                  icon {
                     url
                  }
               }
            }
         }
         slug
      }
   }
`;
