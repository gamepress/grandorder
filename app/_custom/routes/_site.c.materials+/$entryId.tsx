// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { MaterialsDropLocation } from "./components/Materials.DropLocation";
import { MaterialsMain } from "./components/Materials.Main";
import { MaterialsServantAscSkill } from "./components/Materials.ServantAscSkill";

export { entryMeta as meta };

export async function loader({
   context: { payload, user },
   params,
   request,
}: LoaderFunctionArgs) {
   const fetchCharacterData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: QUERY,
      },
   });

   const fetchAscensionData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: SERVANT_ASCENSION_QUERY,
      },
   });
   const featchSkillData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: SERVANT_SKILL_QUERY,
      },
   });
   const fetchAppendData = fetchEntry({
      payload,
      params,
      request,
      user,
      gql: {
         query: SERVANT_APPEND_QUERY,
      },
   });

   const [{ entry }, ascension, skill, append] = await Promise.all([
      fetchCharacterData,
      fetchAscensionData,
      featchSkillData,
      fetchAppendData,
   ]);

   return json({
      entry,
      material: entry?.data?.Servant,
      ascension: ascension?.entry?.data?.Servants?.docs,
      skill: skill?.entry?.data?.Servants?.docs,
      append: append?.entry?.data?.Servants?.docs,
   });
}

const SECTIONS = {
   main: MaterialsMain,
   "drop-locations": MaterialsDropLocation,
   "servant-requirements": MaterialsServantAscSkill,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();

   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      Material(id: $entryId) {
         id
         name
         icon {
            url
         }
         description
         _item_Type {
            name
         }
         _rarity {
            name
         }
         best_drop_locations {
            ap_per_drop
            quest_dropped_from {
               id
               name
               main_quest_chapter {
                  name
               }
               main_quest {
                  id
                  name
               }
            }
         }
      }
   }
`;

const SERVANT_ASCENSION_QUERY = gql`
   query ($entryId: JSON!) {
      Servants(
         where: {
            ascension_materials__materials__material: { equals: $entryId }
         }
         sort: "library_id"
         limit: 1000
      ) {
         docs {
            id
            slug
            library_id
            name
            icon {
               url
            }
            ascension_materials {
               materials {
                  material {
                     id
                     name
                  }
                  qty
               }
            }
         }
      }
   }
`;

const SERVANT_SKILL_QUERY = gql`
   query ($entryId: JSON!) {
      Servants(
         where: {
            skill_enhancements__materials__material: { equals: $entryId }
         }
         sort: "library_id"
         limit: 1000
      ) {
         docs {
            id
            slug
            library_id
            name
            icon {
               url
            }
            skill_enhancements {
               materials {
                  material {
                     id
                     name
                  }
                  qty
               }
            }
         }
      }
   }
`;

const SERVANT_APPEND_QUERY = gql`
   query ($entryId: JSON!) {
      Servants(
         where: {
            append_skill_enhancements__materials__material: { equals: $entryId }
         }
         sort: "library_id"
         limit: 1000
      ) {
         docs {
            id
            slug
            library_id
            name
            icon {
               url
            }
            append_skill_enhancements {
               materials {
                  material {
                     id
                     name
                  }
                  qty
               }
            }
         }
      }
   }
`;
