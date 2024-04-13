// import * as cheerio from "cheerio";
// export function processAndReturnTableData(element: cheerio.Element) {
//   const $ = cheerio.load(element);
//   const tableElement = $(element).find("table").first();
//   const rows = $(tableElement).find("tr").remove("table").end();
//   rows.each((index, row) => {
//     if (index > 0) return;
//     const columns = $(row).find("td");
//     columns.each((j, column) => {
//       const isNestedTableTd =
//         $(column).closest("table").parent("td").length > 0;
//       if (isNestedTableTd) return;
//       function getName(): string {
//         if ($(column).hasClass("name")) {
//           return $(column).text().trim();
//         }
//         return "atr";
//       }

//       function getType(): string {
//         if ($(column).hasClass("type")) {
//           return $(column).text().trim();
//         }
//         return "-";
//       }

//       function getAttribute(): string {
//         if ($(column).hasClass("attribute")) {
//           return $(column).text().trim();
//         }
//         return "-";
//       }
//       console.log(getName());

//       if ($(column).hasClass("description")) {
//         if ($(tableElement).find("table").length) {
//           console.log("--------");
//           processAndReturnTableData(column);
//         }
//       }
//     });
//   });
//   // console.log($.html());
// }
import * as cheerio from "cheerio";

export class TableDataProcessor {
  private $: cheerio.CheerioAPI;

  constructor(private element: cheerio.Element) {
    this.$ = cheerio.load(element);
  }

  public processAndReturnTableData(forceSkip: boolean = false): void {
    const tableElement = this.$(this.element).find("table").first();
    const rows = this.$(tableElement).find("tr").remove("table").end();

    rows.each((index, row) => {
      let name = "atr";
      if (index > 0) return;
      const columns = this.$(row).find("td");

      columns.each((j, column) => {
        if (this.isNestedTableTd(column) && !forceSkip) return;

        if (name === "atr") {
          name = this.getName(column);
          console.log(name);
        }

        if (this.$(column).hasClass("description")) {
          if (this.$(tableElement).find("table").length) {
            // new TableDataProcessor(column).processAndReturnTableData(true);
            this.processInnerTable(column);
          }
        }
      });
    });
  }

  private isNestedTableTd(column: cheerio.Element): boolean {
    return this.$(column).closest("table").parent("td").length > 0;
  }

  private getName(column: cheerio.Element): string {
    if (this.$(column).hasClass("name")) {
      return this.$(column).text().trim();
    }
    return "atr";
  }

  private getType(column: cheerio.Element): string {
    if (this.$(column).hasClass("type")) {
      return this.$(column).text().trim();
    }
    return "-";
  }

  private getAttribute(column: cheerio.Element): string {
    if (this.$(column).hasClass("attribute")) {
      return this.$(column).text().trim();
    }
    return "-";
  }

  private processInnerTable(column: cheerio.Element) {
    const table = this.$(column);
    const rows = this.$(table).find("tr");

    rows.each((index, row) => {
      let name = "atr";
      const columns = this.$(row).find("td");

      columns.each((j, column) => {
        if (name === "atr") {
          name = this.getName(column);
          console.log(name);
        }
      });
    });
  }
}
