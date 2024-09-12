// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { QuestsEnemies } from "./components/Quests.Enemies";
import { QuestsMain } from "./components/Quests.Main";
import { QuestsDrops, QuestsRewards } from "./components/Quests.Rewards";

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
   main: QuestsMain,
   enemies: QuestsEnemies,
   "quest-drops": QuestsDrops,
   "quest-rewards": QuestsRewards,
};

export default function EntryPage() {
   const { entry } = useLoaderData<typeof loader>();
   const quest = entry?.data?.Quest;

   return <Entry customComponents={SECTIONS} customData={quest} />;
}

const QUERY = gql`
   query ($entryId: String!) {
      Quest(id: $entryId) {
         id
         name
         ap_cost
         bond_points
         qp
         exp
         main_quest {
            id
            name
            slug
            icon {
               url
            }
         }
         quest_type {
            name
         }
         quest_content {
            text
         }
         quest_details {
            battle_stage
            quest_parts
            guest_servants {
               id
               name
            }
            enemy_details {
               enemy {
                  relationTo
                  value {
                     ... on Enemy {
                        id
                        name
                        slug
                        icon {
                           url
                        }
                        class_rarity {
                           icon {
                              url
                           }
                        }
                     }
                     ... on Servant {
                        id
                        name
                        slug
                        icon {
                           url
                        }
                     }
                  }
               }
               level
               hp
               enemy_class {
                  icon {
                     url
                  }
               }
               break_bars {
                  icon {
                     url
                  }
               }
               details
               enemy_alternative {
                  enemy {
                     relationTo
                     value {
                        ... on Enemy {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                           class_rarity {
                              icon {
                                 url
                              }
                           }
                        }
                        ... on Servant {
                           id
                           name
                           slug
                           icon {
                              url
                           }
                        }
                     }
                  }
                  level
                  hp
                  enemy_class {
                     icon {
                        url
                     }
                  }
                  break_bars {
                     icon {
                        url
                     }
                  }
                  details
               }
            }
         }
         quest_drops {
            mat {
               relationTo
               value {
                  ... on Material {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on Servant {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on CraftEssence {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on CommandCode {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
               }
            }
            qty
            percentage
            max_number_drops
            other
         }
         quest_rewards {
            mat {
               relationTo
               value {
                  ... on Material {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on Servant {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on CraftEssence {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
                  ... on CommandCode {
                     id
                     name
                     slug
                     icon {
                        url
                     }
                  }
               }
            }
            qty
            other
         }
      }
   }
`;
