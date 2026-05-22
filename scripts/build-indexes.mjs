// build-indexes.mjs — generates index.json after next build
// Output: out/index.json — synced to S3 as /books/tapestry-nocode/index.json
import fs from "node:fs";
import path from "node:path";

const CONTENT_DIR =
  process.env.CONTENT_DIR ?? path.join(process.cwd(), "../tapestry-nocode");
const OUT_DIR = path.join(process.cwd(), "out");

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return {};
  const meta = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return meta;
}

const files = fs
  .readdirSync(CONTENT_DIR)
  .filter((f) => /^\d+\.md$/.test(f))
  .sort();

const chapters = files.map((filename) => {
  const meta = parseFrontmatter(
    fs.readFileSync(path.join(CONTENT_DIR, filename), "utf8"),
  );
  const slug = filename.replace(/\.md$/, "");
  return {
    slug,
    title: meta.title || slug,
    summary: meta.summary || "",
    url: `/books/tapestry-nocode/${slug}`,
  };
});

fs.writeFileSync(
  path.join(OUT_DIR, "index.json"),
  JSON.stringify({ version: 1, book: "tapestry-nocode", chapters }, null, 2),
);

console.log(`index.json: ${chapters.length} chapter(s)`);
