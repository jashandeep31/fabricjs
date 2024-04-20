import path from "path";
import fs from "fs";

const contentDir = path.join(process.cwd(), "../../data");

export const getProperties = async (
  status: boolean = false,
  slug: string
): Promise<any[] | null> => {
  try {
    if (status !== true) return null;
    const filePath = path.join(contentDir, slug + ".json");
    const fileData = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(fileData);
    return data;
  } catch (error) {
    return null;
  }
};
