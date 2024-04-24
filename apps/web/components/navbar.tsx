"use client";
import Link from "next/link";
import React, { useState } from "react";
import { navbarDesktopLinks } from "../config/navbar.config";
import { usePathname } from "next/navigation";
import { cn } from "../lib/utils";
import { Github, Menu, X } from "lucide-react";
import NavbarMobileMenu from "./navbar-mobile-menu";
import SearchBoxMenuButton from "./search-box-menu-button";

const Navbar = () => {
  const pathname = usePathname();

  const [mobileMenuState, setMobileMenuState] = useState<boolean>(false);

  return (
    <div className="bg-background border-b sticky  ">
      <div className="container py-3 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <Link href="/">
            <h1 className="text-lg font-bold flex items-center gap-1">
              Fabric JS <span className="text-[10px] font-light ">Alpha</span>{" "}
            </h1>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {navbarDesktopLinks.map((item, index) => (
              <nav key={index}>
                <Link
                  href={item.path}
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
        <div className="flex items-center gap-2">
          <SearchBoxMenuButton />
          <div>
            <Link href={"/"}>
              <Github size={20} />
            </Link>
          </div>
          <button
            onClick={() => setMobileMenuState(true)}
            className="block md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
      <NavbarMobileMenu
        mobileMenuState={mobileMenuState}
        setMobileMenuState={setMobileMenuState}
      />
    </div>
  );
};

export default Navbar;
