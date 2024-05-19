"use client";
import PropertyCard from "@/components/property-card";
import React, { useEffect } from "react";

// eslint-disable-next-line no-unused-vars
const PropertiesRender = ({ properties }: any) => {
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      const element = document.getElementById(hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);
  if (!properties) {
    return null;
  }

  return (
    <div>
      {properties.map((property: any, index: number) => (
        <PropertyCard property={property} key={index} />
      ))}
    </div>
  );
};

export default PropertiesRender;
