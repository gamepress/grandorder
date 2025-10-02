// Core Imports
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { gql } from "graphql-request";
import { fetchWithCache } from "~/utils/cache.server";

import { Entry } from "~/routes/_site+/c_+/$collectionId_.$entryId/components/Entry";
import { entryMeta } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/entryMeta";
import { fetchEntry } from "~/routes/_site+/c_+/$collectionId_.$entryId/utils/fetchEntry.server";

import { ServantSkillEffectsMain } from "./components/ServantSkillEffects.Main";

export { entryMeta as meta };

async function fetchGQL(query: string, variables?: Record<string, any>) {
   const { data, errors } = await fetchWithCache(
      `http://localhost:4000/api/graphql`,
      {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify({
            query,
            variables,
         }),
      },
      60000,
   );

   if (errors) {
      console.error(JSON.stringify(errors)); // eslint-disable-line no-console
      // throw new Error();
   }

   return data;
}

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
   var eid = entry?.id;

   // http://localhost:3000/c/servant-skill-effects/796
   var sklist = await fetchGQL(ServantSkillQuery, { jsonEntryId: eid });
   var nplist = await fetchGQL(NoblePhantasmQuery, { jsonEntryId: eid });
   var npoclist = await fetchGQL(NoblePhantasmOverchargeQuery, {
      jsonEntryId: eid,
   });

   var skillids = [
      ...new Set(sklist?.ServantSkills?.docs?.map((doc: any) => doc.id)),
   ] as string[];
   var npids = [
      ...new Set(nplist?.NoblePhantasms?.docs?.map((doc: any) => doc.id)),
      ...new Set(npoclist?.NoblePhantasms?.docs?.map((doc: any) => doc.id)),
   ] as string[];

   var npupgradebaselist = await fetchGQL(NoblePhantasmUpgradeBaseQuery, {
      npIdList: npids,
   });
   var upgradenpids = [
      ...new Set(
         npupgradebaselist?.NoblePhantasms?.docs?.map((doc: any) => doc.id),
      ),
   ] as string[];

   var servants_skill_base = await fetchGQL(ServantQuerySkillBase, {
      servantIdList: skillids,
   });
   var servants_skill_upgrade = await fetchGQL(ServantQuerySkillUpgrade, {
      servantIdList: skillids,
   });
   var servants_np_base = await fetchGQL(ServantQueryNPAll, {
      servantIdList: npids,
   });
   var servants_np_upgrade = await fetchGQL(ServantQueryNPAll, {
      servantIdList: upgradenpids,
   });
   return json({
      entry,
      servants_skill_base: servants_skill_base?.Servants?.docs,
      servants_skill_upgrade: servants_skill_upgrade?.Servants?.docs,
      servants_np_base: servants_np_base?.Servants?.docs,
      servants_np_upgrade: servants_np_upgrade?.Servants?.docs,
   });
}

const SECTIONS = {
   main: ServantSkillEffectsMain,
};

export default function EntryPage() {
   const loaderdata = useLoaderData<typeof loader>();
   const { entry } = loaderdata; // 796

   // return "Check Console Log";
   return <Entry customComponents={SECTIONS} customData={loaderdata} />;
}
const QUERY = gql`
   query ($entryId: String!) {
      ServantSkillEffect(id: $entryId) {
         id
         name
         icon {
            url
         }
      }
   }
`;

const ServantSkillQuery = gql`
   query ($jsonEntryId: JSON) {
      ServantSkills(
         where: { effect_list__effect: { equals: $jsonEntryId } }
         limit: 10000
      ) {
         docs {
            id
         }
      }
   }
`;

const NoblePhantasmQuery = gql`
   query ($jsonEntryId: JSON) {
      NoblePhantasms(
         where: { effect_list__effect: { equals: $jsonEntryId } }
         limit: 5000
      ) {
         docs {
            id
         }
      }
   }
`;

const NoblePhantasmOverchargeQuery = gql`
   query ($jsonEntryId: JSON) {
      NoblePhantasms(
         where: { effect_list_overcharge__effect: { equals: $jsonEntryId } }
         limit: 5000
      ) {
         docs {
            id
         }
      }
   }
`;

const NoblePhantasmUpgradeBaseQuery = gql`
   query ($npIdList: [JSON]) {
      NoblePhantasms(limit: 2000, where: { np_upgrades: { in: $npIdList } }) {
         docs {
            id
         }
      }
   }
`;

const ServantQuerySkillBase = `
query ($servantIdList: [JSON]) {
  Servants(limit: 2000, where: { skills__skill: { in: $servantIdList } }) {
    docs {
      id
      name
      slug
      icon{ url }
      star_rarity { id }
      class { id }
      skills {
         skill {
            id
            name
            _skill_Image {
               icon {
                  url
               }
            }
            effect_list {
               effect {
                  id
                  name
               }
               target {
                  name
               }
               value_single
               value_type
               turns
               times
               effect_condition {
                  relationTo
                  value {
                     ... on _alignment {
                        name
                     }
                  }
                  value {
                     ... on Attribute {
                        name
                     }
                  }
                  value {
                     ... on _buffCategory {
                        name
                     }
                  }
                  value {
                     ... on _class {
                        name
                     }
                  }
                  value {
                     ... on _commandCard {
                        name
                     }
                  }
                  value {
                     ... on _enemyTrait {
                        name
                     }
                  }
                  value {
                     ... on _fieldType {
                        name
                     }
                  }
                  value {
                     ... on _statusEffect {
                        name
                     }
                  }
                  value {
                     ... on Trait {
                        name
                     }
                  }
               }
               effect_on_damage_turns
               effect_on_damage_times
               values_per_level
               chance_per_level
            }
         }
      }
    }
  }
}
`;

const ServantQuerySkillUpgrade = `
query ($servantIdList: [JSON]) {
  Servants(limit: 2000, where: { skills__upgrades__skill: { in: $servantIdList } }) {
    docs {
      id
      name
      slug
      icon{ url }
      star_rarity { id }
      class { id }
      skills {
         upgrades {
            skill {
               id
               name
               _skill_Image {
                  icon {
                     url
                  }
               }
               effect_list {
                  effect {
                     id
                     name
                  }
                  target {
                     name
                  }
                  value_single
                  value_type
                  turns
                  times
                  effect_condition {
                     relationTo
                     value {
                        ... on _alignment {
                           name
                        }
                     }
                     value {
                        ... on Attribute {
                           name
                        }
                     }
                     value {
                        ... on _buffCategory {
                           name
                        }
                     }
                     value {
                        ... on _class {
                           name
                        }
                     }
                     value {
                        ... on _commandCard {
                           name
                        }
                     }
                     value {
                        ... on _enemyTrait {
                           name
                        }
                     }
                     value {
                        ... on _fieldType {
                           name
                        }
                     }
                     value {
                        ... on _statusEffect {
                           name
                        }
                     }
                     value {
                        ... on Trait {
                           name
                        }
                     }
                  }
                  effect_on_damage_turns
                  effect_on_damage_times
                  values_per_level
                  chance_per_level
               }
            }
         }
      }
    }
  }
}
`;

const ServantQueryNPAll = `
query ($servantIdList: [JSON]) {
  Servants(limit: 2000, where: { noble_phantasm_base: { in: $servantIdList } }) {
    docs {
      id
      name
      slug
      icon{ url }
      star_rarity { id }
      class { id }
      noble_phantasm_base {
         id
         name
         card_type {
            icon { url }
         }
         effect_list {
            effect {
               id
               name
            }
            target {
               name
            }
            turns
            times
            effect_condition {
               relationTo
               value {
                  ... on _alignment {
                     name
                  }
               }
               value {
                  ... on Attribute {
                     name
                  }
               }
               value {
                  ... on _buffCategory {
                     name
                  }
               }
               value {
                  ... on _class {
                     name
                  }
               }
               value {
                  ... on _commandCard {
                     name
                  }
               }
               value {
                  ... on _enemyTrait {
                     name
                  }
               }
               value {
                  ... on _fieldType {
                     name
                  }
               }
               value {
                  ... on _statusEffect {
                     name
                  }
               }
               value {
                  ... on Trait {
                     name
                  }
               }
            }
            effect_on_damage_turns
            effect_on_damage_times
            values_per_level
            chance_per_level

         }
         effect_list_overcharge {
            effect {
               id
               name
            }
            target {
               name
            }
            turns
            times
            effect_condition {
               relationTo
               value {
                  ... on _alignment {
                     name
                  }
               }
               value {
                  ... on Attribute {
                     name
                  }
               }
               value {
                  ... on _buffCategory {
                     name
                  }
               }
               value {
                  ... on _class {
                     name
                  }
               }
               value {
                  ... on _commandCard {
                     name
                  }
               }
               value {
                  ... on _enemyTrait {
                     name
                  }
               }
               value {
                  ... on _fieldType {
                     name
                  }
               }
               value {
                  ... on _statusEffect {
                     name
                  }
               }
               value {
                  ... on Trait {
                     name
                  }
               }
            }
            effect_on_damage_turns
            effect_on_damage_times
            values_per_level
            chance_per_level
         }
         np_upgrades {
            id
            name
            card_type {
               icon { url }
            }
            effect_list {
               effect {
                  id
                  name
               }
               target {
                  name
               }
               turns
               times
               effect_condition {
                  relationTo
                  value {
                     ... on _alignment {
                        name
                     }
                  }
                  value {
                     ... on Attribute {
                        name
                     }
                  }
                  value {
                     ... on _buffCategory {
                        name
                     }
                  }
                  value {
                     ... on _class {
                        name
                     }
                  }
                  value {
                     ... on _commandCard {
                        name
                     }
                  }
                  value {
                     ... on _enemyTrait {
                        name
                     }
                  }
                  value {
                     ... on _fieldType {
                        name
                     }
                  }
                  value {
                     ... on _statusEffect {
                        name
                     }
                  }
                  value {
                     ... on Trait {
                        name
                     }
                  }
               }
               effect_on_damage_turns
               effect_on_damage_times
               values_per_level
               chance_per_level
            }
            effect_list_overcharge {
               effect {
                  id
                  name
               }
               target {
                  name
               }
               turns
               times
               effect_condition {
                  relationTo
                  value {
                     ... on _alignment {
                        name
                     }
                  }
                  value {
                     ... on Attribute {
                        name
                     }
                  }
                  value {
                     ... on _buffCategory {
                        name
                     }
                  }
                  value {
                     ... on _class {
                        name
                     }
                  }
                  value {
                     ... on _commandCard {
                        name
                     }
                  }
                  value {
                     ... on _enemyTrait {
                        name
                     }
                  }
                  value {
                     ... on _fieldType {
                        name
                     }
                  }
                  value {
                     ... on _statusEffect {
                        name
                     }
                  }
                  value {
                     ... on Trait {
                        name
                     }
                  }
               }
               effect_on_damage_turns
               effect_on_damage_times
               values_per_level
               chance_per_level
            }
         }
      }
    }
  }
}
`;
