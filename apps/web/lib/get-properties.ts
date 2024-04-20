import path from "path";
import fs from "fs";

const contentDir = path.join(process.cwd(), "../../data");

export const getProperties = async (
  rawPath: string,
  slug: string
): Promise<any[] | null> => {
  try {
    const filePath = path.join(contentDir, slug + ".json");
    console.log(filePath);
    const fileData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileData);
    return data;
  } catch (error) {
    return null;
  }
};
