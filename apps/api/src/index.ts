import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { scrapper } from "./scrapper";
import { generateAllFile } from "./generateStaticFiles";
const PORT = process.env.PORT || 8000;

async function main() {
  const parameters = {
    url: "http://fabricjs.com/docs/fabric.Rect.html",
    dist: "html/objects",
    currentUrl: "html/objects/rectangle",
    name: "React",
    uniqueId: "HTML.Objects.React",
    forceRefresh: false,
  };
  // const parameters = {
  //   url: "http://fabricjs.com/docs/fabric.Image.filters.Convolute.html",
  //   dist: "html/image/filters",
  //   currentUrl: "html/image/filters/convolute",
  //   name: "Image.Filter",
  //   uniqueId: "HTML.Image.Filter.Convolute",
  //   forceRefresh: false,
  // };

  await scrapper(
    ...(Object.values(parameters) as [
      string,
      string,
      string,
      string,
      string,
      boolean,
    ])
  );
  generateAllFile();
}

main();
const app = express();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
