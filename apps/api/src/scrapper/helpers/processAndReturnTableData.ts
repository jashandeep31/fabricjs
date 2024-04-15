import * as cheerio from "cheerio";
import {
  ComplexPropertyTableRow,
  PropertyTableRow,
  SimplePropertyTableRow,
} from "../scrapper.types";

export class TableDataProcessor {
  private $: cheerio.CheerioAPI;

  constructor(private element: cheerio.Element) {
    this.$ = cheerio.load(element);
  }

  public processAndReturnTableData(
    forceSkipParse: boolean = false
  ): PropertyTableRow[] {
    const tableArray: PropertyTableRow[] = [];

    const tableElement = this.$(this.element).find("table").first();
    let rows = this.$(tableElement).find("tr").remove("table").end();
    if (forceSkipParse) {
      rows = this.$(tableElement).find("tr");
    }

    rows.each((index, row) => {
      let rowData: SimplePropertyTableRow | ComplexPropertyTableRow = {
        name: "atr",
        type: "-",
        attribute: "-",
        hasTable: false,
        description: "",
      };

      if (forceSkipParse && index === 0) {
        return;
      }

      const columns = this.$(row).find("td");

      columns.each((j, column) => {
        if (this.isNestedTableTd(column) && !forceSkipParse) return;

        if (rowData.name === "atr") {
          rowData.name = this.getName(column);
        }
        if (rowData.type === "-") {
          rowData.type = this.getType(column);
        }

        if (this.$(column).hasClass("description")) {
          if (this.$(tableElement).find("table").length) {
            const innerTableData: any[] = new TableDataProcessor(
              column
            ).processAndReturnTableData(true);
            rowData = {
              ...rowData,
              hasTable: true,
              description: innerTableData,
            };
          } else {
            rowData.description = this.$(column).text().trim();
          }
        }
      });
      if (rowData.hasTable) {
        tableArray.push(rowData as ComplexPropertyTableRow);
      } else {
        tableArray.push(rowData as SimplePropertyTableRow);
      }
    });
    return tableArray;
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
}
