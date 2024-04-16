import fs from "fs";
import {
  processAndReturnProperty,
  scrapStoreAndReturnRawData,
} from "./helpers";
import * as cheerio from "cheerio";
import { Property } from "./scrapper.types";
import db from "../utils/db";
import { PREV_WEBSITE_URL_BASE, ROOT_PATH } from "../utils";
import { PropertiesListToDataBase } from "./helpers/databaseHandlers";

export const scrapper = async (
  url: string,
  dist: string,
  currentUrl: string,
  name: string,
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
    // console.log(index);
    if (index === 1) {
      const parsedProperty = processAndReturnProperty(
        element,
        url,
        uniqueId,
        currentUrl
      );
      propertiesList.push(parsedProperty);
    }
  });

  // console.log(htmlFilePath);
  // if (!forceRefresh) {
  //   return;
  // }

  const propertiesListToDatabaseClass = new PropertiesListToDataBase({
    properties: propertiesList,
    url,
    dist,
    currentUrl,
    name,
    uniqueId,
    forceRefresh,
  });

  // fs.writeFileSync(
  //   ROOT_PATH + "/temp.json",
  //   JSON.stringify(propertiesList, null, 2)
  // );

  // await db
  //   .$transaction(async (tx) => {
  //     const processedData =
  //       await propertiesListToDatabaseClass.processAndAddData(tx);
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });
};
