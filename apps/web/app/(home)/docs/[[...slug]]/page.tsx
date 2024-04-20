import React from "react";
import { getPageBySlug } from "../../../../lib/mdx-helpers";
import Mdx from "../../../../components/mdx-components";
import { getProperties } from "@/lib/get-properties";
import PropertyCard from "@/components/property-card";

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
  const properties = await getProperties(data.meta.properties, completeSlug);

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

      {properties && properties.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Properties
          </h2>
          {properties.map((property, index) => (
            <PropertyCard property={property} key={index} />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default page;
