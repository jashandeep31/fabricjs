import Mdx from "@/components/mdx-components";
import { getPageBySlug } from "@/lib/mdx-helpers";
import React from "react";

const page = async ({ params }: { params: { slug: string[] } }) => {
  let completeSlug = "/docs/" + params.slug.join("/");
  if (completeSlug.endsWith("html")) {
    completeSlug = completeSlug + "/index";
  }
  // adding docs as initial to target the docs folder in the pages directory
  const data = await getPageBySlug(completeSlug);
  if (!data) {
    return <div>Page not found</div>;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

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
