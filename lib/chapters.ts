import fs from "node:fs";
import path from "node:path";
import { marked } from "marked";

const CONTENT_DIR =
  process.env.CONTENT_DIR ?? path.join(process.cwd(), "../tapestry-nocode");

export interface ChapterMeta {
  slug: string;
  title: string;
  summary: string;
}

export interface Chapter extends ChapterMeta {
  html: string;
  prev?: string;
  next?: string;
}

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split("\n")) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    meta[line.slice(0, colon).trim()] = line.slice(colon + 1).trim();
  }
  return { meta, body: match[2] };
}

export function getChapters(): ChapterMeta[] {
  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => /^\d+\.md$/.test(f))
    .sort();

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, filename), "utf-8");
    const { meta } = parseFrontmatter(raw);
    return {
      slug: filename.replace(/\.md$/, ""),
      title: meta.title || filename.replace(/\.md$/, ""),
      summary: meta.summary || "",
    };
  });
}

export function getChapter(slug: string): Chapter {
  const raw = fs.readFileSync(path.join(CONTENT_DIR, `${slug}.md`), "utf-8");
  const { meta, body } = parseFrontmatter(raw);
  const html = marked(body) as string;

  const chapters = getChapters();
  const idx = chapters.findIndex((c) => c.slug === slug);

  return {
    slug,
    title: meta.title || slug,
    summary: meta.summary || "",
    html,
    prev: idx > 0 ? chapters[idx - 1].slug : undefined,
    next: idx < chapters.length - 1 ? chapters[idx + 1].slug : undefined,
  };
}
