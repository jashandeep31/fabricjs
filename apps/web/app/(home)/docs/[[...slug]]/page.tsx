import React from "react";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPageBySlug } from "../../../../lib/mdx-helpers";
import Mdx from "../../../../components/mdx-components";

const page = async ({ params }: { params: { slug: string[] } }) => {
  const completeSlug = params.slug.join("/");
  // adding docs as initial to target the docs folder in the pages directory
  const data = await getPageBySlug("docs/" + completeSlug);
  if (!data) {
    return <div>Page not found</div>;
  }

  // const file = fs.readFileSync()
  const contentDir = path.join(process.cwd(), "pages/");

  const fileData = fs.readFileSync(
    path.join(contentDir, "/docs/html/objects/rectangle.mdx")
  );

  return (
    <div className="md:mt-12 mt-6">
      <div className="space-y-2">
        <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
          Introduction
        </h1>

        <p className="text-lg text-muted-foreground">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Mollitia
          voluptate obcaecati veniam modi accusantium architecto totam
          voluptatum enim fugit, similique quaerat perspiciatis. Mollitia
          explicabo tenetur aspernatur ipsum nemo, vel ratione.
        </p>
      </div>

      <div className="mt-8">
        {/* <MDXRemote>{data.content}</MDXRemote> */}

        <Mdx>{data.content}</Mdx>
      </div>
    </div>
  );
};

export default page;
