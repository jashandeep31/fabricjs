"use client";
import { navbarDesktopLinks } from "@/config/navbar.config";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import { htmlDocsLinks } from "@/config/menu-config";

const NavbarMobileMenu = ({
  mobileMenuState,
  setMobileMenuState,
}: {
  mobileMenuState: boolean;
  setMobileMenuState: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuState(false);
  }, [pathname]);

  return (
    <div className={`${!mobileMenuState ? "hidden" : "block"}  `}>
      <div className="fixed top-0 left-0 w-full z-10 bg-foreground/60 h-screen flex justify-end">
        <div className={`bg-background w-3/4 p-3 navbar-mobile-animation`}>
          <div className="flex gap-2 items-center justify-between border-b pb-3">
            <h2 className="font-bold">Menu</h2>
            <button onClick={() => setMobileMenuState(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="h-full  overflow-scroll">
            <div className="mt-3 space-y-2">
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
            <div className="mt-6">
              <h3 className="text-foreground/60 font-bold">HTML Menu</h3>
              {htmlDocsLinks.map((item, index) => (
                <div key={index} className="mt-4">
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
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
