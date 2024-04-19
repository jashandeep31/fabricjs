"use client";
import { htmlDocsLinks } from "@/config/menu-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useLayoutEffect, useState, useMemo } from "react";

const AsideBarDocs = () => {
  const pathname = usePathname();
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
      <div className="md:pt-12 pt-6 grid gap-6">
        {htmlDocsLinks.map((item, index) => (
          <div key={index} className="">
            <h3 className="font-medium text-sm">{item.title}</h3>
            <ul className=" pl-1 mt-1 space-y-1">
              {item.links.map((link, j) => (
                <li key={j}>
                  <Link
                    href={link.path}
                    className={`${pathname === link.path ? "text-foreground font-medium underline " : "text-foreground/60"} text-sm hover:underline `}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AsideBarDocs;
