import * as cheerio from "cheerio";
export function processAndReturnTableData(element: cheerio.Element) {
  const $ = cheerio.load(element);
  const firstTable = $(element).find("table").first();
  // console.log($.html());
  if (!firstTable) {
  }
}
