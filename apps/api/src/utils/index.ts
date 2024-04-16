import path from "path";

export const ROOT_PATH = path.join(__dirname, "../../");
export const TURBO_ROOT_PATH = path.join(__dirname, "../../../../");

export const PREV_WEBSITE_URL_BASE = "http://fabricjs.com/";

export const getCustomSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[-/.]+/g, "-") // Replace one or more instances of -, /, or . with a single -
    .replace(/[^a-z0-9-_]/g, ""); // Remove characters that are not alphanumeric, -, or _
};
