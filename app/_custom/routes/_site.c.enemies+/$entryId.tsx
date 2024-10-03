// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { EnemiesMain } from "~/_custom/routes/_site.c.enemies+/components/Enemies.Main";
import type { Enemy as EnemyType } from "payload/generated-custom-types";
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
   main: EnemiesMain,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const enemy = entry?.data?.Enemy as EnemyType;

   return <Entry customComponents={SECTIONS} customData={enemy} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      Enemy(id: $entryId) {
         id
         name
         desc_skills
         desc_np
         icon {
            url
         }
         class_rarity {
            name
            icon {
               url
            }
         }
         traits {
            id
            name
         }
         slug
      }
   }
`;
