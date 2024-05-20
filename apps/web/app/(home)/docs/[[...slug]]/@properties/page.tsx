import PropertyCard from "@/components/property-card";
import { getProperties } from "@/lib/get-properties";
import React from "react";
import PropertiesRender from "./page.client";

const properties = async ({ params }: { params: { slug: string[] } }) => {
  let completeSlug = "/docs/" + params.slug.join("/");
  if (completeSlug.endsWith("html")) {
    completeSlug = completeSlug + "/index";
  }

  const properties = await getProperties(true, completeSlug);

  return (
    <div>
      {" "}
      This is getting rendererd
      {properties && properties.length > 0 ? (
        <div className="mt-8">
          <h2 className="font-heading mt-12 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
            Properties
          </h2>
          <PropertiesRender properties={properties} />
          {/* {properties.map((property, index) => (
            <PropertyCard property={property} key={index} />
          ))} */}
        </div>
      ) : null}
    </div>
  );
};

export default properties;
