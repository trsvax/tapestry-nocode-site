# AGENTS.md

Guidance for automated agents working in this repository.

## Don't make assumptions. If you don't know something, say so.

---

## Project Overview

`tapestry-nocode-site` is the builder for the Tapestry NoCode book. It reads
markdown chapters from `trsvax/tapestry-nocode`, renders them to static HTML,
and deploys to S3 at `/books/tapestry-nocode/`.

This repo contains no content. Content lives in `trsvax/tapestry-nocode`.

---

## Architecture

```
lib/
  chapters.ts         Reads ../tapestry-nocode/*.md, parses frontmatter, renders with marked

app/
  layout.tsx          Root layout — loads globals.css
  page.tsx            Table of contents
  [chapter]/
    page.tsx          Individual chapter — generateStaticParams + marked render

scripts/
  build-indexes.mjs   Generates out/index.json after next build

.github/
  workflows/
    deploy.yml        Build + S3 sync to /books/tapestry-nocode/ + CloudFront invalidation
```

## Content Source

Chapters are `01.md`–`11.md` at the root of `trsvax/tapestry-nocode`.
Each has YAML frontmatter: `title`, `image`, `summary`.

In local dev, the content repo must be cloned at `../tapestry-nocode/` relative
to this repo. Override with the `CONTENT_DIR` env variable.

## Deploy

Push to `main` → GitHub Actions:

1. Checks out this repo and `trsvax/tapestry-nocode`
2. `npm ci && npm run build` — generates `out/` and `out/index.json`
3. Syncs `out/` to `s3://<bucket>/books/tapestry-nocode/`
4. Invalidates CloudFront at `/books/tapestry-nocode/*`

Secrets required: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`,
`S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`.

After deploy, run the aggregate workflow in `trsvax/theTube` to update `site.json`.

## Adding a New Chapter

Add a new `NN.md` file to `trsvax/tapestry-nocode`. No changes needed here —
chapters are auto-discovered by the `\d\d\.md` filename pattern.

_Last updated: 2026-05-16_
