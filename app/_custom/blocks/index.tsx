import { nanoid } from "nanoid";
import { DefaultElement, useReadOnly } from "slate-react";

import { Icon } from "~/components/Icon";

import { ExampleBlock } from "./Example";
import { QuestEnemyCompact } from "./_questEnemyCompact";
import { ServantOverview } from "./_servantOverview";
import { ServantNPGain } from "./_servantNPGain";
import { ServantMaterials } from "./_servantMaterials";
import { ServantSkill } from "./_servantSkill";
import { ServantNoblePhantasm } from "./_servantNoblePhantasm";
enum BlockType {
   CustomComponent = "customComponent",
   QuestEnemyCompactView = "questEnemyCompactView",
   ServantOverviewView = "servantOverviewView",
   ServantNPGainView = "servantNPGainView",
   ServantMaterialsView = "servantMaterialsView",
   ServantSkillView = "servantSkillView",
   ServantNoblePhantasmView = "servantNoblePhantasmView",
}

type CustomComponent = {
   id: string;
   type: BlockType.CustomComponent;
   children: [{ text: "" }];
};

export const CustomBlocks = ({ element, children, attributes }: any) => {
   switch (element.type) {
      case BlockType.CustomComponent: {
         return <ExampleBlock element={element} children={children} />;
      }
      case BlockType.QuestEnemyCompactView: {
         return <QuestEnemyCompact element={element} children={children} />;
      }
      case BlockType.ServantOverviewView: {
         return <ServantOverview element={element} children={children} />;
      }
      case BlockType.ServantNPGainView: {
         return <ServantNPGain element={element} children={children} />;
      }
      case BlockType.ServantMaterialsView: {
         return <ServantMaterials element={element} children={children} />;
      }
      case BlockType.ServantSkillView: {
         return <ServantSkill element={element} children={children} />;
      }
      case BlockType.ServantNoblePhantasmView: {
         return <ServantNoblePhantasm element={element} children={children} />;
      }
      default:
         //Render default element if no custom blocks match
         return (
            <DefaultElement element={element} attributes={attributes}>
               {children}
            </DefaultElement>
         );
   }
};

export const CustomBlocksAddConfig = (onSelect: any) => {
   return {
      // label: "Custom",
      // items: [
      //    {
      //       label: "Sample Component",
      //       icon: <Icon name="component" size={20} />,
      //       description: "Sample component description",
      //       onSelect: () => {
      //          onSelect({
      //             id: nanoid(),
      //             stringField: "test",
      //             type: BlockType.CustomComponent,
      //             children: [{ text: "" }],
      //          });
      //       },
      //    },
      // ],
      label: "Custom",
      items: [
         {
            label: "Quest Enemy Compact View",
            icon: <Icon name="component" size={20} />,
            description: "Summarized Enemy Layout View for Quests",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.QuestEnemyCompactView,
                  children: [{ text: "" }],
               });
            },
         },
         {
            label: "Servant Overview",
            icon: <Icon name="component" size={20} />,
            description: "Servant Summarized Stats and Traits",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.ServantOverviewView,
                  children: [{ text: "" }],
               });
            },
         },
         {
            label: "Servant NP Gain",
            icon: <Icon name="component" size={20} />,
            description: "Servant NP Gain / Star Gain Stats",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.ServantNPGainView,
                  children: [{ text: "" }],
               });
            },
         },
         {
            label: "Servant Materials",
            icon: <Icon name="component" size={20} />,
            description: "Servant Ascension / Skill / Append Materials",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.ServantMaterialsView,
                  children: [{ text: "" }],
               });
            },
         },
         {
            label: "Servant Skill",
            icon: <Icon name="component" size={20} />,
            description: "Servant Skill with Description and Values",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.ServantSkillView,
                  children: [{ text: "" }],
               });
            },
         },
         {
            label: "Servant Noble Phantasm",
            icon: <Icon name="component" size={20} />,
            description: "Servant NP with Description and Values",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  refId: "",
                  type: BlockType.ServantNoblePhantasmView,
                  children: [{ text: "" }],
               });
            },
         },
      ],
   };
};
