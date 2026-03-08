import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, "..");

const AUDIO_EXTENSIONS = new Set([
  ".mp3", ".ogg", ".wav", ".m4a", ".aac", ".mp4", ".webm", ".flac", ".opus"
]);

async function scanAudioFiles(dirName) {
  const absoluteDir = path.join(root, dirName);
  const entries = await fs.readdir(absoluteDir, { withFileTypes: true });

  return entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => AUDIO_EXTENSIONS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, "ru"))
    .map((name) => `${dirName}/${name}`);
}

async function writeManifest(dirName) {
  const files = await scanAudioFiles(dirName);
  const manifestPath = path.join(root, dirName, "manifest.json");
  const content = JSON.stringify({ files }, null, 2) + "\n";
  await fs.writeFile(manifestPath, content, "utf8");
  console.log(`Updated ${dirName}/manifest.json (${files.length} files)`);
}

await writeManifest("music");
await writeManifest("interruptions");
