import express from "express";
import { scrapper } from "./scrapper";
const PORT = 8000;

async function main() {
  scrapper("http://fabricjs.com/docs/fabric.Rect.html");
}

main();
const app = express();

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
