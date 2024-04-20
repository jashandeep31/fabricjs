import { serialize } from "next-mdx-remote/serialize";
import fs from "fs";
import path from "path";
// import { mdxSerializer } from "./lib/mdx-serializer";
// const { mdxSerializer } = require("./lib/mdx-serializer");

function checkAndCreateDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

const PAGE_DIR = path.join(process.cwd(), "pages");
const FINAL_PAGE_DIR = path.join(process.cwd(), ".pages");

fs.watch(PAGE_DIR, { recursive: true }, async (eventType, filename) => {
  const fullPath = path.join(PAGE_DIR, filename ?? "");

  const rawData = fs.readFileSync(fullPath);

  const mdxContent = await serialize(rawData);
  console.log(mdxContent);

  // const FINAL_PATH = fullPath.replace(PAGE_DIR, FINAL_PAGE_DIR);
  // checkAndCreateDir(FINAL_PATH);
});
