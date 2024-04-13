import axios from "axios";
import { PREV_WEBSITE_URL_BASE, ROOT_PATH, getCustomSlug } from "../../utils";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { TableDataProcessor } from "./processAndReturnTableData";
// import { processAndReturnTableData } from "./processAndReturnTableData";

// constants
const HTML_CACHE_PATH = `${ROOT_PATH}/html-cache`;

function checkOrCreateDirectory(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

export async function scrapStoreAndReturnRawData(
  url: string,
  outputPath: string,
  force: boolean = false
): Promise<string> {
  const uniSlug = getCustomSlug(url);

  const filePath = path.join(HTML_CACHE_PATH, `${outputPath}/${uniSlug}.html`);

  checkOrCreateDirectory(path.join(HTML_CACHE_PATH, outputPath));
  const isFileExists = fs.existsSync(filePath);

  // if file exists and force is false then return the file path else fetch the data and write it to the file
  if (isFileExists && !force) {
    return filePath;
  } else {
    const htmlCode = await axios.get(url).then((res) => res.data); // fetch the data
    fs.writeFileSync(filePath, htmlCode);
    return filePath;
  }
}

export async function proccessAndReturnProperty(
  element: cheerio.Element,
  url: string
) {
  const $ = cheerio.load(element);
  const allAnchorTags = $(element).find("a");

  // gettting the title of the property
  let title: string = "";
  allAnchorTags.first().each((index, aTag) => {
    $(aTag).each((index, element) => {
      $(element).find("span.type-signature").remove();
      title = $(element).text();
    });
  });
  // getting the dscription of the property
  const description = $(element).find("div.description").text().trim();

  // getting the prev website url for reference (!!   PREV_WEBSITE_URL_BASE is used to make url the dynamic   !!)
  const prevUrl =
    url +
    $(element).find("a:first").attr("href")?.replace(PREV_WEBSITE_URL_BASE, "");
  console.log(prevUrl);

  const table = $(element).find("table").first();
  if (table.length) {
    // console.log("table found ✅");
    // processAndReturnTableData(element);
    const processor = new TableDataProcessor(element);

    // Process the table data
    processor.processAndReturnTableData();
  } else {
    // direct process the data
    // console.log("table not found ❌");
  }
}
