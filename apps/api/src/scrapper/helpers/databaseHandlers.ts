import { Page, Prisma } from "@prisma/client";
import { PREV_WEBSITE_URL_BASE } from "../../utils";
import { Property } from "../scrapper.types";
import { Property as DBProperty } from "@prisma/client";
interface IPropertiesListToDataBase {
  url: string;
  dist: string;
  currentUrl: string;
  name: string;
  uniqueId: string;
  forceRefresh: boolean;
  properties: Property[];
}

export class PropertiesListToDataBase implements IPropertiesListToDataBase {
  url: string;
  dist: string;
  currentUrl: string;
  name: string;
  uniqueId: string;
  forceRefresh: boolean;
  properties: Property[];

  constructor(data: IPropertiesListToDataBase) {
    this.url = data.url;
    this.dist = data.dist;
    this.currentUrl = data.currentUrl;
    this.name = data.name;
    this.uniqueId = data.uniqueId;
    this.forceRefresh = data.forceRefresh;
    this.properties = data.properties;
  }

  public async processAndAddData(tx: Prisma.TransactionClient) {
    await tx.extendedPropertyTableRow.deleteMany({});
    await tx.extendedPropertyTable.deleteMany({});
    await tx.propertyTableRow.deleteMany({});
    await tx.propertyTable.deleteMany({});
    await tx.property.deleteMany({});
    await tx.page.deleteMany({});

    const page = await this.createPage(tx);
    // this.properties.map(async (item, index) => {
    for (const [itemIndex, item] of this.properties.entries()) {
      const property = await this.createProperty(page, item, tx);
      const propertyTable = await this.createPropertyTable(property, tx);

      // item.table.map(async (row, index) => {
      for (const [rowIndex, row] of item.table.entries()) {
        if (row.hasTable) {
          const tableRow = await tx.propertyTableRow.create({
            data: {
              name: row.name,
              order: rowIndex,
              type: row.type,
              attribute: row.attribute,
              extendedRow: true,
              propertyTableId: propertyTable.id,
            },
          });
          const extendedTable = await tx.extendedPropertyTable.create({
            data: {
              propertyTableRowId: tableRow.id,
            },
          });
          // row.description.map(async (extTable, index) => {
          for (const [extTableIndex, extTable] of row.description.entries()) {
            if (extTable.hasTable === false) {
              await tx.extendedPropertyTableRow.create({
                data: {
                  order: extTableIndex,
                  name: extTable.name,
                  type: extTable.type,
                  attribute: extTable.attribute,
                  description: extTable.description,
                  extendedPropertyTableId: extendedTable.id,
                },
              });
            }
          }
        } else {
          await tx.propertyTableRow.create({
            data: {
              name: row.name,
              order: rowIndex,
              type: row.type,
              attribute: row.attribute,
              description: row.description,
              propertyTableId: propertyTable.id,
            },
          });
        }
      }
    }
    console.log("done", await tx.property.count());
    return page;
  }

  private async createPage(tx: Prisma.TransactionClient) {
    const page = await tx.page.create({
      data: {
        uniqueId: this.uniqueId,
        prevUrl: this.url.replace(PREV_WEBSITE_URL_BASE, ""),
        currentUrl: this.currentUrl,
        filePath: this.dist,
        name: this.name,
      },
    });

    return page;
  }
  private async createProperty(
    page: Page,
    item: Property,
    tx: Prisma.TransactionClient
  ) {
    // check the unique id presense
    const propertyCheck = await tx.property.findFirst({
      where: {
        uniqueId: item.uniqueId,
      },
    });
    let uniqueId = item.uniqueId;

    if (propertyCheck) {
      uniqueId = item.uniqueId + "-" + Math.random().toString();
    }

    const property = await tx.property.create({
      data: {
        name: item.name,
        description: item.description,
        prevUrl: item.prevUrl,
        currentUrl: item.completeUrl,
        uniqueId: uniqueId,
        pageId: page.id,
      },
    });
    return property;
  }

  private async createPropertyTable(
    property: DBProperty,
    tx: Prisma.TransactionClient
  ) {
    const propertyTable = await tx.propertyTable.create({
      data: {
        propertyId: property.id,
      },
    });
    return propertyTable;
  }
}
