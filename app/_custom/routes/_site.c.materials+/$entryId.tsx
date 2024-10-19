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
   main: MaterialsMain,
   "drop-locations": MaterialsDropLocation,
   "servant-requirements": MaterialsServantAscSkill,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();

   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}

const QUERY = gql`
   query ($entryId: String!, $jsonEntryId: JSON) {
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
         ce_With_Drop_Bonus {
            id
            slug
            name
            _rarity {
               icon_frame {
                  url
               }
            }
            icon {
               url
            }
         }
      }
      ascensionData: Servants(
         where: {
            ascension_materials__materials__material: { equals: $jsonEntryId }
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
      skillData: Servants(
         where: {
            skill_enhancements__materials__material: { equals: $jsonEntryId }
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
      appendData: Servants(
         where: {
            append_skill_enhancements__materials__material: {
               equals: $jsonEntryId
            }
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
