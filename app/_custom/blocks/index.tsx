import { nanoid } from "nanoid";
import { DefaultElement, useReadOnly } from "slate-react";

import { Icon } from "~/components/Icon";

import { ExampleBlock } from "./Example";
enum BlockType {
   CustomComponent = "customComponent",
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
      label: "Custom",
      items: [
         {
            label: "Example",
            icon: <Icon name="component" size={20} />,
            description: "Example component description",
            onSelect: () => {
               onSelect({
                  id: nanoid(),
                  type: BlockType.CustomComponent,
                  children: [{ text: "" }],
               });
            },
         },
      ],
   };
};
