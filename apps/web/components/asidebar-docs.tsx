"use client";
import Link from "next/link";
import React, { useLayoutEffect, useState, useMemo } from "react";

const AsideBarDocs = () => {
  const [navbarHeight, setNavbarHeight] = useState("3.5rem");

  const calculateAsideBarHeight = useMemo(() => {
    return `calc(100vh - ${navbarHeight})`;
  }, [navbarHeight]);

  useLayoutEffect(() => {
    try {
      const navbar = document.querySelector("header");
      if (navbar) setNavbarHeight(navbar.clientHeight + "px");
    } catch (error) {
      setNavbarHeight("3.5rem");
    }
  }, []);

  return (
    <div
      className={`border-r sticky`}
      style={{ height: calculateAsideBarHeight, top: navbarHeight }}
    >
      <div className="md:pt-12 pt-6">
        <div>
          <h3 className="font-medium text-sm">Getting Started</h3>
          <ul className=" pl-1 mt-1 space-y-1">
            <li>
              <Link
                href="/docs/html/objects/rectangle"
                className="text-foreground/60 text-sm hover:underline "
              >
                Introduction
              </Link>
            </li>
            <li>
              <Link
                href="/docs/html/objects/rectangle"
                className="text-foreground/60 text-sm hover:underline "
              >
                Getting Started
              </Link>
            </li>
            <li>
              <Link
                href="/docs/html/objects/rectangle"
                className="text-foreground/60 text-sm hover:underline "
              >
                Why Fabric Js?
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AsideBarDocs;
