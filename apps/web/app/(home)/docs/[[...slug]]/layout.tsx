import React from "react";

const layout = ({
  children,
  properties,
}: {
  properties: React.ReactNode;
  children: React.ReactNode;
}) => {
  return (
    <div>
      {children}
      {properties}
    </div>
  );
};

export default layout;
