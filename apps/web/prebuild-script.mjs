import fs from "fs";
import path from "path";
import { serialize } from "next-mdx-remote/serialize";
import rehypePrettyCode from "rehype-pretty-code";
import { visit } from "unist-util-visit";

/** @type {import('rehype-pretty-code').Options} */
const REHYPE_THEME_OPTIONS = {
  // theme: "github-light",
  theme: "aurora-x",
  // theme: "dracula",
  keepBackground: false,
};

const PAGES_DIR = path.join(process.cwd(), "/pages");
const PROPERTIES_DIR = path.join(process.cwd(), "../..", "data");
const FINAL_PAGES_DIR = path.join(process.cwd(), ".pages");
const QUERIES_FILE = path.join(process.cwd(), "search_queries.ts");

function checkAndCreateDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function verifyAndMoveMdxFiles(dir) {
  const files = fs.readdirSync(dir);
  const TITTLES_ARRAY = [];

  for (const file of files) {
    const stats = fs.statSync(path.join(dir, file));
    if (stats.isDirectory()) {
      verifyAndMoveMdxFiles(path.join(dir, file));
    } else if (file.endsWith(".mdx")) {
      const rawData = fs.readFileSync(path.join(dir, file));
      const RAW_FILE_PATH = path.join(dir, file);

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

      TITTLES_ARRAY.push({ name: meta.title });
      fs.writeFileSync(
        QUERIES_FILE,
        `export const search_queries:{name:string}[] = ${JSON.stringify(TITTLES_ARRAY)};`
      );

      if (meta.properties === true) {
        const propertiesPath = path.join(
          RAW_FILE_PATH.replace(PAGES_DIR, PROPERTIES_DIR).replace(
            ".mdx",
            ".json"
          )
        );
        console.log(propertiesPath.replace(PROPERTIES_DIR, FINAL_PAGES_DIR));
        if (!fs.existsSync(propertiesPath)) {
          console.log("Properties file not found");
        } else {
          checkAndCreateDir(
            path.join(
              propertiesPath.replace(PROPERTIES_DIR, FINAL_PAGES_DIR),
              ".."
            )
          );
          fs.copyFileSync(
            propertiesPath,
            propertiesPath.replace(PROPERTIES_DIR, FINAL_PAGES_DIR)
          );
        }
      }
      const FINAL_PATH = path.join(
        RAW_FILE_PATH.replace(PAGES_DIR, FINAL_PAGES_DIR)
      );
      const FINAL_DIR = path.join(FINAL_PATH, "..");
      checkAndCreateDir(FINAL_DIR);
      fs.copyFileSync(RAW_FILE_PATH, FINAL_PATH);
    }
  }
}

verifyAndMoveMdxFiles(PAGES_DIR);
