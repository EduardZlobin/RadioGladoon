import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const folders = ["music", "interruptions"];
const allowed = new Set([".mp3", ".ogg", ".wav", ".m4a", ".aac", ".flac"]);

async function buildManifest(folderName) {
  const folderPath = path.join(root, folderName);
  const items = await fs.readdir(folderPath, { withFileTypes: true });

  const files = items
    .filter((item) => item.isFile())
    .map((item) => item.name)
    .filter((name) => allowed.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "ru"))
    .map((name) => `${folderName}/${name}`);

  const manifestPath = path.join(folderPath, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(files, null, 2) + "\n", "utf8");
  console.log(`Готово: ${folderName}/manifest.json (${files.length} файлов)`);
}

for (const folder of folders) {
  await buildManifest(folder);
}
