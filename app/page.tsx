import { getChapters } from "@/lib/chapters";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tapestry NoCode — Table of Contents",
};

export default function IndexPage() {
  const chapters = getChapters();
  return (
    <div className="page-content">
      <h1>Tapestry NoCode</h1>
      <p>
        Building a Hotel Booking application with Apache Tapestry 5: maximum
        functionality, maximum reusability, minimal code.
      </p>
      <ol className="chapter-list">
        {chapters.map((ch) => (
          <li key={ch.slug}>
            <Link href={`/books/tapestry-nocode/${ch.slug}`}>{ch.title}</Link>
            {ch.summary && <p>{ch.summary}</p>}
          </li>
        ))}
      </ol>
    </div>
  );
}
