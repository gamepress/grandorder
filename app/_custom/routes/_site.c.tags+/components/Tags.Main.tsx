import { Image } from "~/components/Image";

export const TagsMain = ({ data }: any) => {
   const tagdata = data?.tag;
   const icon = tagdata.icon?.url;
   const description = tagdata.description;

   return (
      <>
         <div className="mb-3 rounded-md border border-color-sub p-3 text-center">
            <Image
               width={36}
               height={36}
               url={icon}
               className="mx-auto"
               options="aspect_ratio=1:1&height=80&width=80"
            />

            <div
               className="whitespace-wrap"
               dangerouslySetInnerHTML={{ __html: description }}
            ></div>
         </div>
      </>
   );
};
