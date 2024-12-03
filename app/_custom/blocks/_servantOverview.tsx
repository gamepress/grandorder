import type { ReactNode } from "react";
import React, { Fragment, useState, useEffect } from "react";

import {
   DndContext,
   type DragEndEvent,
   type DragStartEvent,
   closestCenter,
} from "@dnd-kit/core";
import {
   SortableContext,
   arrayMove,
   rectSortingStrategy,
   verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { offset } from "@floating-ui/react";
import { Combobox, Transition } from "@headlessui/react";
import { Float } from "@headlessui-float/react";
import { request as gqlRequest, gql } from "graphql-request";
import { Transforms, Node, Editor } from "slate";
import type { BaseEditor } from "slate";
import { ReactEditor, useSlate } from "slate-react";
import { useReadOnly } from "slate-react";
import useSWR from "swr";

import type { Entry } from "payload/generated-types";
import { Button } from "~/components/Button";
import { Icon } from "~/components/Icon";

// eslint-disable-next-line import/no-cycle
import { type CustomElement } from "~/routes/_editor+/core/types";

import { ServantOverviewView } from "./ServantOverviewView";

export const GROUP_COLORS = [
   "#a1a1aa",
   "#f87171",
   "#fb923c",
   "#facc15",
   "#4ade80",
   "#60a5fa",
   "#c084fc",
   "#f472b6",
];

//@ts-ignore
const GroupDnDContext = React.createContext();

export function ServantOverview({
   element,
   children,
}: {
   element: any;
   children: ReactNode;
}) {
   const editor = useSlate();
   const isGroupEmpty = element?.children[0]?.path ? false : true;

   const [groupSelectQuery, setGroupSelectQuery] = useState("");

   const [selected] = useState();

   const readOnly = useReadOnly();

   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Servants(where:{name:{contains:"${groupSelectQuery}"}}) {
               docs {
                  id
                  name
               }
            }
         }
      `,
      (query: any) =>
         gqlRequest("https://grandorder.gamepress.gg:4000/api/graphql", query),
   );
   const entryData = data?.Servants?.docs;

   const filteredEntries =
      groupSelectQuery === ""
         ? [] //TODO Make this pull default set, used to be "entryData"
         : entryData?.filter((item: Entry) =>
              item.name
                 .toLowerCase()
                 .replace(/\s+/g, "")
                 .includes(groupSelectQuery.toLowerCase().replace(/\s+/g, "")),
           );

   interface Editors extends BaseEditor, ReactEditor {}

   // {{TO DO}}
   // ADAPT THE BELOW to update the entry correctly instead of using new entry, we don't need to push more children elements, we need to replace the element's refId

   function handleUpdateBlockEntry(event: any, editor: Editors, element: any) {
      const path = ReactEditor.findPath(editor, element);
      setRefId(event.id);
      return Transforms.setNodes<CustomElement>(
         editor,
         { refId: event.id },
         {
            at: path,
         },
      );
   }

   // DND Functions
   const [activeId, setActiveId] = useState<string | null>(null);

   function handleDragStart(event: DragStartEvent) {
      setActiveId(event.active.id as string);
   }

   const [groupItems, setGroupItems] = useState(
      isGroupEmpty ? [] : element.children.map((item) => item.id),
   );

   function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (active.id !== over?.id) {
         setGroupItems((items) => {
            const oldIndex = items.findIndex((x) => {
               return x === active.id;
            });

            const newIndex = items.findIndex((x) => {
               return x === over?.id;
            });

            return arrayMove(items, oldIndex, newIndex);
         });
      }
   }

   const [refId, setRefId] = useState(element.refId);

   const [isElementEditorOpen, setElementEditor] = useState(
      element.refId == "",
   );

   return (
      <div contentEditable={false} className="mb-3 relative">
         {!readOnly && (
            <Float
               middleware={[
                  offset({
                     mainAxis: 8,
                     crossAxis: -22,
                  }),
               ]}
               dialog
               placement="left-start"
               portal
            >
               <Float.Reference>
                  <div className="flex size-10 laptop:absolute -right-12 top-0">
                     <Button
                        className="size-9 !p-0"
                        color="light/zinc"
                        onClick={() => setElementEditor(!isElementEditorOpen)}
                        contentEditable={false}
                     >
                        <Icon name="list-plus" size={16} />
                     </Button>
                  </div>
               </Float.Reference>
               <div></div>
            </Float>
         )}

         <Transition appear show={isElementEditorOpen} as={Fragment}>
            <div className="relative w-full laptop:w-[728px] px-4">
               <div
                  className="flex px-2 py-0.5 shadow-xl border-2 items-center shadow-1 bg-3-sub border-color-sub
                                    justify-center transform rounded-full"
               >
                  <div className="flex w-full items-center gap-3">
                     <Combobox
                        value={selected}
                        onChange={(e: any) => {
                           handleUpdateBlockEntry(e, editor, element);
                           setRefId(e?.id);
                           setElementEditor(false);
                        }}
                     >
                        <div className="flex-grow">
                           <div className="flex items-center gap-3">
                              <Combobox.Button
                                 className="group flex-none shadow-sm border border-color dark:border-zinc-600 rounded-full 
                                                   w-7 h-7 flex items-center justify-center bg-zinc-50 dark:bg-dark450"
                              >
                                 {({ open }) => (
                                    <Icon
                                       name="plus"
                                       className={`${
                                          open ? "rotate-45" : ""
                                       } transform transition duration-300 ease-in-out`}
                                       size={16}
                                    />
                                 )}
                              </Combobox.Button>
                              <Combobox.Input
                                 autoFocus
                                 className="bg-3-sub h-10 w-full border-0 px-0 focus:outline-none focus:ring-0"
                                 placeholder="Search..."
                                 name="search"
                                 onChange={(event) =>
                                    setGroupSelectQuery(event.target.value)
                                 }
                              />
                              <div
                                 className="group flex-none shadow-sm border border-color dark:border-zinc-600 rounded-full 
                                                   w-7 h-7 flex items-center justify-center bg-zinc-50 dark:bg-dark450"
                                 onClick={() => setElementEditor(false)}
                              >
                                 <Icon
                                    name="plus"
                                    className={`rotate-45`}
                                    size={16}
                                 />
                              </div>
                           </div>
                           <Transition
                              as={Fragment}
                              leave="transition ease-in duration-100 z-30"
                              leaveFrom="opacity-100"
                              leaveTo="opacity-0"
                              afterLeave={() => setGroupSelectQuery("")}
                           >
                              <Combobox.Options
                                 className="dark:bg-dark350 bg-white border-color-sub divide-color-sub no-scrollbar absolute left-0 z-10 mt-2 max-h-60
                                                 w-full divide-y overflow-auto rounded-xl border drop-shadow-xl focus:outline-none"
                              >
                                 {filteredEntries?.length === 0 ? (
                                    <div className="relative text-center cursor-default select-none p-3 text-sm">
                                       Nothing found.
                                    </div>
                                 ) : (
                                    filteredEntries?.map((entry: Entry) => (
                                       <Combobox.Option
                                          key={entry.id}
                                          className={({ active }) =>
                                             `cursor-default select-none p-2 text-sm font-bold ${
                                                active
                                                   ? "bg-zinc-50 dark:bg-dark400"
                                                   : ""
                                             } flex items-center gap-2`
                                          }
                                          value={entry}
                                       >
                                          <>
                                             <span
                                                className="border-color shadow-1 flex h-8 w-8 flex-none items-center
                                                                  justify-between overflow-hidden rounded-full border shadow-sm"
                                             >
                                                <Icon
                                                   name="component"
                                                   className="text-1 mx-auto"
                                                   size={18}
                                                />
                                             </span>
                                             <span className="flex-grow">
                                                {entry.name}
                                             </span>
                                          </>
                                       </Combobox.Option>
                                    ))
                                 )}
                              </Combobox.Options>
                           </Transition>
                        </div>
                     </Combobox>
                  </div>
               </div>
            </div>
         </Transition>
         <section>
            <DndContext
               onDragStart={handleDragStart}
               onDragEnd={handleDragEnd}
               collisionDetection={closestCenter}
            >
               <GroupDnDContext.Provider value={{ groupItems, setGroupItems }}>
                  <ServantOverviewView refId={refId} />
               </GroupDnDContext.Provider>
            </DndContext>
         </section>
      </div>
   );
}
