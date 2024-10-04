import type { ReactNode } from "react";
import { gql, request as gqlRequest } from "graphql-request";

import useSWR from "swr";

import type { ListElement } from "~/routes/_editor+/core/types";
import { Loading } from "~/components/Loading";
import { Servant } from "~/db/payload-custom-types";

type Props = {
   element: ListElement;
   children: ReactNode;
};

export const ExampleBlock = ({ element, children }: Props) => {
   const { data, error, isLoading } = useSWR(
      gql`
         query {
            Servants {
               docs {
                  name
               }
            }
         }
      `,
      (query: any) => gqlRequest("http://localhost:4000/api/graphql", query),
   );
   if (error) return null;
   if (isLoading) return <Loading />;

   //@ts-ignore
   const servant = data?.Servants?.docs[0] as Servant;

   return (
      <div contentEditable={false} className="">
         <div className="border border-color-sub shadow-1 shadow-color p-3 rounded-lg bg-2-sub">
            {servant.name}
         </div>
      </div>
   );
};
