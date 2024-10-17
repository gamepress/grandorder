import { nanoid } from "nanoid";
import { DefaultElement, useReadOnly } from "slate-react";

import { Icon } from "~/components/Icon";

import { ExampleBlock } from "./Example";
import { QuestEnemyCompactView } from "./QuestEnemyCompactView";
import { QuestEnemyCompact } from "./_questEnemyCompact";
enum BlockType {
   CustomComponent = "customComponent",
   QuestEnemyCompactView = "questEnemyCompactView",
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
      label: "Quest Enemy Compact View",
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
      ],
   };
};
