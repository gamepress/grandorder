// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { IllustratorsMain } from "./components/Illustrators.Main";
import { IllustratorsCraftEssences } from "./components/Illustrators.CraftEssences";
import { IllustratorsCommandCodes } from "./components/Illustrators.CommandCodes";

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
      illustrator: entry?.data?.Illustrator,
      servants: entry?.data?.Servants?.docs,
   });
}

const SECTIONS = {
   main: IllustratorsMain,
   ces: IllustratorsCraftEssences,
   ccs: IllustratorsCommandCodes,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const { entry } = loaderdata;

   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}

const QUERY = gql`
   query ($entryId: String!, $jsonEntryId: JSON) {
      Illustrator(id: $entryId) {
         id
         name
         slug
         ce_With_Illustrator {
            id
            library_number
            name
            slug
            icon {
               url
            }
            _rarity {
               id
               name
               icon_frame {
                  url
               }
            }
         }
         cc_With_Illustrator {
            id
            command_code_id
            name
            slug
            icon {
               url
            }
            rarity {
               id
               name
            }
         }
      }
      Servants(
         where: {
            illustrator: { equals: $jsonEntryId }
            library_id: { not_equals: null }
            name: { not_equals: "Mash (Ortinax)" }
         }
         limit: 1000
      ) {
         docs {
            id
            name
            library_id
            slug
            icon {
               url
            }
            class {
               id
               icon {
                  url
               }
            }
            star_rarity {
               id
               name
            }
            release_status {
               id
               name
            }
         }
      }
   }
`;
