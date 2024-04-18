import React from "react";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";

const page = () => {
  // const file = fs.readFileSync()
  const contentDir = path.join(process.cwd(), "pages/");
  const fileData = fs.readFileSync(
    path.join(contentDir, "/docs/html/objects/rectangle.mdx")
  );
  return (
    <div>
      Hello to home page
      <MDXRemote source={fileData} />
    </div>
  );
};

export default page;
