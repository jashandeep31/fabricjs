import React from "react";
import { getPageBySlug } from "../../../../lib/mdx-helpers";
import Mdx from "../../../../components/mdx-components";

const page = async ({ params }: { params: { slug: string[] } }) => {
  let completeSlug = params.slug.join("/");
  if (completeSlug.endsWith("html")) {
    completeSlug = completeSlug + "/index";
  }
  // adding docs as initial to target the docs folder in the pages directory
  const data = await getPageBySlug("docs/" + completeSlug);
  if (!data) {
    return <div>Page not found</div>;
  }

  return (
    <div className="md:mt-12 mt-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          {data.meta.title}
        </h1>

        <p className="text-lg text-muted-foreground">{data.meta.description}</p>
      </div>

      <div className="mt-8">
        <Mdx>{data.content}</Mdx>
      </div>
    </div>
  );
};

export default page;
