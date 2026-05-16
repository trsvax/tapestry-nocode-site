import { getChapters, getChapter } from "@/lib/chapters";
import Link from "next/link";
import type { Metadata } from "next";

export function generateStaticParams() {
  return getChapters().map((ch) => ({ chapter: ch.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const ch = getChapter(chapter);
  return { title: `${ch.title} — Tapestry NoCode` };
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const ch = getChapter(chapter);

  return (
    <>
      <div className="post-header">
        <h1>{ch.title}</h1>
        {ch.summary && <p className="post-summary">{ch.summary}</p>}
      </div>
      <div
        className="post-body"
        dangerouslySetInnerHTML={{ __html: ch.html }}
      />
      <div className="post-footer">
        <Link href="/books/tapestry-nocode" className="back-link">
          ← Table of Contents
        </Link>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {ch.prev && (
            <Link href={`/books/tapestry-nocode/${ch.prev}`}>← Previous</Link>
          )}
          {ch.next && (
            <Link href={`/books/tapestry-nocode/${ch.next}`}>Next →</Link>
          )}
        </div>
      </div>
    </>
  );
}
