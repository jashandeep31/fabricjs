// we are going to scrap and store the data in this file

import fs from "fs";
import {
  processAndReturnProperty,
  scrapStoreAndReturnRawData,
} from "./helpers";
import * as cheerio from "cheerio";
import { Property } from "./scrapper.types";
import { ROOT_PATH } from "../utils";

export const scrapper = async (url: string) => {
  const htmlFilePath = await scrapStoreAndReturnRawData(url, "objects");

  // processing the html file using cheerio
  const htmlFileContent = fs.readFileSync(htmlFilePath, "utf-8");
  const $ = cheerio.load(htmlFileContent);

  // getting the list of all the properties of the page  (!! This is not 100% accurate, some are missing !!)
  const properties = $("div.inherited");

  const propertiesList: Property[] = [];
  properties.each((index: number, element: cheerio.Element) => {
    // if (index === 161) {
    const parsedProperty = processAndReturnProperty(element, url);
    propertiesList.push(parsedProperty);
  });
  console.log(propertiesList.length);
  // console.log(propertiesList);
  // fs.writeFileSync(ROOT_PATH + "sample.json", JSON.stringify(propertiesList));
};
