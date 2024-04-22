import { serialize } from "next-mdx-remote/serialize";
import fs from "fs";
import path from "path";
// import { mdxSerializer } from "./lib/mdx-serializer";
// const { mdxSerializer } = require("./lib/mdx-serializer");
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

/** @type {import('rehype-pretty-code').Options} */
const REHYPE_THEME_OPTIONS = {
  // theme: "github-light",
  theme: "aurora-x",
  // theme: "dracula",
  keepBackground: false,
};

function checkAndCreateDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const PROPERTIES_DIR = path.join(process.cwd(), "../..", "data");
const PAGE_DIR = path.join(process.cwd(), "pages");
const FINAL_PAGE_DIR = path.join(process.cwd(), ".pages");

fs.watch(PAGE_DIR, { recursive: true }, async (eventType, filename) => {
  try {
    const RAW_FILE_PATH = path.join(PAGE_DIR, filename ?? "");

    const rawData = fs.readFileSync(RAW_FILE_PATH);

    const mdxContent = await serialize(rawData, {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [],
        rehypePlugins: [
          () => (tree) =>
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
          () => (tree) =>
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
      },
    });

    const data = {
      meta: {
        title: mdxContent.frontmatter.title,
        description: mdxContent.frontmatter.description,
        properties: mdxContent.frontmatter.properties,
      },
      content: mdxContent,
    };
    const { meta } = data;
    if (!meta.title) {
      console.log("Title is required");
      return;
    }
    if (!meta.description) {
      console.log("Description is required");
      return;
    }

    if (meta.properties === true) {
      const propertiesPath = path.join(
        RAW_FILE_PATH.replace(PAGE_DIR, PROPERTIES_DIR).replace(".mdx", ".json")
      );
      console.log(propertiesPath.replace(PROPERTIES_DIR, FINAL_PAGE_DIR));
      if (!fs.existsSync(propertiesPath)) {
        console.log("Properties file not found");
      } else {
        fs.copyFileSync(
          propertiesPath,
          propertiesPath.replace(PROPERTIES_DIR, FINAL_PAGE_DIR)
        );
      }
    }

    const FINAL_PATH = path.join(
      RAW_FILE_PATH.replace(PAGE_DIR, FINAL_PAGE_DIR)
    );
    const FINAL_DIR = path.join(FINAL_PATH, "..");
    checkAndCreateDir(FINAL_DIR);
    fs.copyFileSync(RAW_FILE_PATH, FINAL_PATH);
  } catch (error) {
    console.log("OHOH! Error: ", error);
  }
});
