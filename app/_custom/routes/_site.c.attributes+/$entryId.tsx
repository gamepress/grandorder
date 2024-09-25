// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { AttributesMain } from "./components/Attributes.Main";

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
      attribute: entry?.data?.Attribute,
      servants: entry?.data?.Servants?.docs,
   });
}

const SECTIONS = {
   main: AttributesMain,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const { entry } = loaderdata;

   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}

const QUERY = gql`
   query ($entryId: String!, $jsonEntryId: JSON) {
      Attribute(id: $entryId) {
         id
         name
         slug
      }
      Servants(
         where: {
            attribute: { equals: $jsonEntryId }
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
