import fs from "fs";
import {
  processAndReturnProperty,
  scrapStoreAndReturnRawData,
} from "./helpers";
import * as cheerio from "cheerio";
import { Property } from "./scrapper.types";

export const scrapper = async (
  url: string,
  dist: string,
  uniqueId: string,
  forceRefresh: boolean = false
) => {
  const htmlFilePath = await scrapStoreAndReturnRawData(
    url,
    dist,
    forceRefresh
  );

  const htmlFileContent = fs.readFileSync(htmlFilePath, "utf-8");
  const $ = cheerio.load(htmlFileContent);

  // (!! This is not 100% accurate, some are missing !!)
  const properties = $("div.inherited");

  const propertiesList: Property[] = [];
  properties.each((index: number, element: cheerio.Element) => {
    const parsedProperty = processAndReturnProperty(element, url);
    propertiesList.push(parsedProperty);
  });
};
