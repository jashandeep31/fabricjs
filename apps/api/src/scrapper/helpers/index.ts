import axios from "axios";
import { PREV_WEBSITE_URL_BASE, ROOT_PATH, getCustomSlug } from "../../utils";
import * as cheerio from "cheerio";
import path from "path";
import fs from "fs";
import { TableDataProcessor } from "./processAndReturnTableData";
import { Property, PropertyTableRow } from "../scrapper.types";

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

export function processAndReturnProperty(
  element: cheerio.Element,
  url: string
): Property {
  const $ = cheerio.load(element);

  const allAnchorTags = $(element).find("a");

  const getTitle = (): string => {
    let title: string = "";
    allAnchorTags.first().each((index, aTag) => {
      $(aTag).each((index, element) => {
        $(element).find("span.type-signature").remove();
        $(element).find("span.signature").remove();
        title = $(element).text();
      });
    });
    return title;
  };
  let title = getTitle();
  const description = $(element).find("div.description").text().trim();

  // (!!  by removing PREV_WEBSITE_URL_BASE from url to make it dynamic with new domain name if changed in future   !!)
  const prevUrl = (url + $(element).find("a:first").attr("href")).replace(
    PREV_WEBSITE_URL_BASE,
    ""
  );

  let isInherited = false;
  const inheritedUrl = (
    url + $(element).find("dl a:first ").attr("href")
  ).replace(PREV_WEBSITE_URL_BASE, "");
  console.log(inheritedUrl);
  console.log(prevUrl);

  const table = $(element).find("table").first();
  if (table.length) {
    const processor = new TableDataProcessor(element);
    const res: PropertyTableRow[] = processor.processAndReturnTableData();
    return {
      name: title,
      uniqueId: title,
      completeUrl: title,
      prevUrl: prevUrl,
      description: description,
      table: res,
    };
  } else {
    return {
      name: title,
      uniqueId: title,
      completeUrl: title,
      prevUrl: prevUrl,
      description: description,
      table: [],
    };
  }
}
