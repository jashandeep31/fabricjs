import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemoteSerializeResult } from "next-mdx-remote";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

/** @type {import('rehype-pretty-code').Options} */
const REHYPE_THEME_OPTIONS = {
  // theme: "github-light",
  theme: "aurora-x",
  // theme: "dracula",
  keepBackground: false,
};

export async function mdxSerializer(
  fileData: string
): Promise<
  MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>>
> {
  return serialize(fileData, {
    parseFrontmatter: true,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [
        () => (tree: any) =>
          visit(tree, (node) => {
            if (node?.type === "element" && node?.tagName === "pre") {
              const [codeEl] = node.children;
              if (codeEl.tagName !== "code") {
                return;
              }

              let __title__ = "";
              if (codeEl.data?.meta.includes("title=")) {
                const regex = /title="([^"]*)"/;
                const match = codeEl.data?.meta.match(regex);
                __title__ = match ? match[1] : "";
              }

              let __outPut__ = false;
              if (codeEl.data?.meta.includes("output=true")) {
                __outPut__ = true;
              }
              node.__rawString__ = codeEl.children?.[0].value;
              node.__title__ = __title__;
              node.__outPut__ = __outPut__;
            }
          }),
        [rehypePrettyCode, REHYPE_THEME_OPTIONS],
        () => (tree: any) =>
          visit(tree, (node) => {
            if (node?.type === "element") {
              if (!("data-rehype-pretty-code-figure" in node.properties)) {
                return;
              }
              const preElement = node.children.at(-1);
              if (preElement.tagName !== "pre") {
                return;
              }
              if (node.__title__) {
                preElement.properties["__title__"] = node.__title__;
              }
              if (node.__outPut__) {
                preElement.properties["__output__"] = node.__outPut__;
              } else {
                preElement.properties["__output__"] = false;
              }
              preElement.properties["__rawString__"] = node.__rawString__;
            }
          }),
      ],
    } as any,
  });
}
