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

    let rows = this.$(tableElement).find("tr");
    rows = rows.filter((index, element) => {
      return this.$(element).parents("table").length === 1;
    });

    if (forceSkipParse) {
      rows = this.$(tableElement).find("tr");
    }

    rows.each((index, row) => {
      if (index === 0) return;

      let rowData: SimplePropertyTableRow | ComplexPropertyTableRow = {
        name: "atr",
        type: "-",
        attribute: "-",
        hasTable: false,
        description: "",
      };

      const columns = this.$(row).find("td");

      columns.each((j, column) => {
        if (this.isNestedTableTd(column) && !forceSkipParse) return;

        // updating the rawData field here
        this.populateRowData(rowData, column);

        // updating the description of the field
        if (this.$(column).hasClass("description")) {
          this.populateDescriptionData(rowData, tableElement, column);
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

  private populateRowData(
    rowData: Partial<SimplePropertyTableRow | ComplexPropertyTableRow>,
    column: cheerio.Element
  ): void {
    const className = this.$(column).attr("class");
    switch (className) {
      case "name":
        rowData.name = this.$(column).text().trim();
        break;
      case "type":
        rowData.type = this.$(column).text().trim();
        break;
    }
  }

  private populateDescriptionData(
    rowData: Partial<SimplePropertyTableRow | ComplexPropertyTableRow>,
    tableElement: cheerio.Cheerio<cheerio.Element>,
    column: cheerio.Element
  ): void {
    if (this.$(tableElement).find("table").length) {
      const innerTableData: any[] = new TableDataProcessor(
        column
      ).processAndReturnTableData(true);
      rowData.hasTable = true;
      rowData.description = innerTableData;
    } else {
      rowData.description = this.$(column).text().trim();
    }
  }

  private isNestedTableTd(column: cheerio.Element): boolean {
    return this.$(column).closest("table").parent("td").length > 0;
  }
}
