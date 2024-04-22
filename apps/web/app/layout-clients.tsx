"use client";
import React from "react";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
const LayoutClient = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      {children}
      <ProgressBar
        height="2px"
        color="#000000"
        options={{ showSpinner: false }}
        shallowRouting
      />
    </div>
  );
};

export default LayoutClient;
