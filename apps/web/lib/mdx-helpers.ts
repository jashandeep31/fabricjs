import fs from "fs";
import path from "path";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import { mdxSerializer } from "./mdx-serializer";

/** @type {import('rehype-pretty-code').Options} */
const REHYPE_THEME_OPTIONS = {
  // theme: "github-light",
  theme: "aurora-x",
  // theme: "dracula",
  keepBackground: false,
};

const contentDir = path.join(process.cwd(), ".pages/");

export async function getPageBySlug(slug: string): Promise<{
  meta: {
    title: string;
    description: string;
    slug: string;
    properties: boolean;
  };
  content: MDXRemoteSerializeResult<
    Record<string, unknown>,
    Record<string, unknown>
  >;
} | null> {
  try {
    const filePath = path.join(contentDir, slug + ".mdx");
    const fileData = fs.readFileSync(filePath, "utf-8");

    const mdxContent = await mdxSerializer(fileData);
    return {
      meta: {
        title: mdxContent.frontmatter.title as string,
        description: mdxContent.frontmatter.description as string,
        properties: mdxContent.frontmatter.properties as boolean,
        slug: filePath,
      },
      content: mdxContent,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
