import type { MysticCode } from "payload/generated-custom-types";

export const MysticCodesOverview = ({ data }: { data: MysticCode }) => {
   return (
      <>
         <OverviewText data={data} />
         <UnlockText data={data} />
      </>
   );
};

const OverviewText = ({ data }: { data: MysticCode }) => {
   const overview = data.overview;
   const styling = `<style>
   ul{list-style-type: disc;margin: 0 0 .75em 25px;} div{white-space:wrap;} p a {color: #448acb;} p{margin-bottom: 0.75rem;}
   </style>`;

   return (
      <>
         <div dangerouslySetInnerHTML={{ __html: styling }}></div>
         <div
            className="my-2 whitespace-wrap"
            dangerouslySetInnerHTML={{ __html: overview }}
         ></div>
      </>
   );
};

const UnlockText = ({ data }: { data: MysticCode }) => {
   const unlock = data.unlock_requirements;

   return (
      <>
         {unlock ? (
            <>
               <h3>Unlock Requirements</h3>
               <a className="text-blue-500" href={`/c/quests/${unlock.id}`}>
                  <div className="my-2 whitespace-wrap">{unlock.name}</div>
               </a>
            </>
         ) : null}
      </>
   );
};
