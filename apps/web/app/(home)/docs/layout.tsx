"use client";
import "./mdx.css";
import React, { useEffect } from "react";
import AsideBarDocs from "../../../components/asidebar-docs";
import { usePathname } from "next/navigation";

const Layout = ({ children }: { children: React.ReactNode }) => {
  // cheap fix !!!
  //  most prob getting occured due to sticky navbar
  const pathname = usePathname();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="container  md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="md:block hidden">
        <AsideBarDocs />
      </aside>
      <div className="pb-12">{children}</div>
    </div>
  );
};

export default Layout;
