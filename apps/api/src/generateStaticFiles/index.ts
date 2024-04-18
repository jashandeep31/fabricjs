import path from "path";
import db from "../utils/db";
import fs from "fs";
import { ROOT_PATH, TURBO_ROOT_PATH } from "../utils";

function checkOrCreateDirectory(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, { recursive: true });
  }
}

export async function generateAllFile() {
  const pages = await db.page.findMany({});

  for (const page of pages) {
    const properties = await db.property.findMany({
      where: {
        pageId: page.id,
      },
      include: {
        PropertyTable: {
          include: {
            PropertyTableRow: {
              include: {
                ExtendedPropertyTable: {
                  include: {
                    ExtendedPropertyTableRow: true,
                  },
                },
              },
            },
          },
        },
      },
    });
    console.log(page);
    const storingPath = path.join(
      TURBO_ROOT_PATH,
      "data",
      page.currentUrl,
      ".."
    );

    console.log(storingPath);
    checkOrCreateDirectory(storingPath);

    fs.writeFileSync(
      `${path.join(TURBO_ROOT_PATH, "data", page.currentUrl + ".json")}`,
      JSON.stringify(properties, null, 2)
    );
  }
}
