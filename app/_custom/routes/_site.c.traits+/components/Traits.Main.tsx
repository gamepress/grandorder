export const TraitsMain = ({ data }: any) => {
   const description = data?.trait?.description;
   return (
      <>
         {/* Traits - Description */}
         {description ? (
            <div className="mb-3 rounded-md border border-color-sub p-3 text-center">
               <div
                  className="whitespace-wrap"
                  dangerouslySetInnerHTML={{ __html: description }}
               ></div>
            </div>
         ) : null}
      </>
   );
};
