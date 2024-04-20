import React from "react";
import { getPageBySlug } from "../../../../lib/mdx-helpers";
import Mdx from "../../../../components/mdx-components";
import { getProperties } from "@/lib/get-properties";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const page = async ({ params }: { params: { slug: string[] } }) => {
  let completeSlug = params.slug.join("/");
  if (completeSlug.endsWith("html")) {
    completeSlug = completeSlug + "/index";
  }
  // adding docs as initial to target the docs folder in the pages directory
  const data = await getPageBySlug("/docs/" + completeSlug);
  if (!data) {
    return <div>Page not found</div>;
  }
  const properties = await getProperties(
    data.meta.propertiesPath,
    "docs/" + completeSlug
  );

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
            <div
              className="mt-6 scroll-m-20"
              key={index}
              id={property.uniqueId}
            >
              <h3 className="font-heading mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
                <Link
                  className="flex items-center gap-1 hover:underline duration-300 "
                  href={property.currentUrl}
                >
                  <ArrowDownRight size={16} />
                  <span>{property.name}</span>
                </Link>
              </h3>
              <p className="leading-7  text-sm text-muted-foreground">
                {property.description}
              </p>
              <div className="h-36 bg-muted my-3 w-full"></div>
              <div>
                <Link
                  className="text-xs bg-foreground/15  inline-flex items-center gap-1  hover:underline rounded-full px-2 py-1"
                  href={property.prevUrl}
                >
                  <span>Legacy Docs</span>
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default page;
