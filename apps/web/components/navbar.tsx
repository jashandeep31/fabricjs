"use client";
import Link from "next/link";
import React from "react";
import { navbarDesktopLinks } from "../config/navbar.config";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";

const Navbar = () => {
  const pathname = usePathname();
  return (
    <div className="bg-background border-b sticky  ">
      <div className="container py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-lg font-bold">Fabric JS</h1>
          <div className="flex items-center gap-4">
            {navbarDesktopLinks.map((item, index) => (
              <nav key={index}>
                <Link
                  href={"/"}
                  className={cn(
                    `text-sm  font-medium ${pathname === item.path ? "text-foreground" : "text-foreground/60 hover:text-foreground/80"} `
                  )}
                >
                  {item.label}
                </Link>
              </nav>
            ))}
          </div>
        </div>
        <div>Github</div>
      </div>
    </div>
  );
};

export default Navbar;
