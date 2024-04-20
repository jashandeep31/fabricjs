import React from "react";
import Navbar from "../../components/navbar";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-10 overflow-hidden">
        <Navbar />
      </header>
      <main className="flex-1 ">{children}</main>
      <footer className="border-t">
        <div className="container py-3">
          <p>Fabric js</p>
        </div>
      </footer>
    </div>
  );
};

export default layout;
