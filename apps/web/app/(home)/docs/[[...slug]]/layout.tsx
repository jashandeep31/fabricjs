import React from "react";
import AsideBarDocs from "../../../../components/asidebar-docs";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container  md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="h-full">
        <AsideBarDocs />
      </aside>
      <div>{children}</div>
    </div>
  );
};

export default layout;
