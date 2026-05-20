import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function splitBlocks(markdown) {
  return markdown.trim().split(/\n{2,}/);
}

function cleanTitle(rawTitle) {
  return rawTitle
    .replace(/^#\s+/, "")
    .replace(/^Reddit Draft V2:\s*/, "")
    .replace(/^X \/ Twitter Draft V2:\s*/, "")
    .replace(/^雪球草稿 V2：\s*/, "")
    .trim();
}

function extractCopywriting(markdown, id) {
  const blocks = splitBlocks(markdown);
  const title = cleanTitle(blocks[0] || "Untitled article");
  const bodyBlocks = [];
  let includeBody = false;

  for (const block of blocks.slice(1)) {
    const firstLine = block.split("\n")[0] || "";

    if (/^(Draft|正文草稿)(?:[:：])$/.test(firstLine)) {
      includeBody = true;
      continue;
    }

    if (id === "x" && /^(Suggested hook|Thread draft)(?:[:：])$/.test(firstLine)) {
      includeBody = true;
      continue;
    }

    if (!includeBody) {
      continue;
    }

    if (/^(Thread draft)(?:[:：])$/.test(firstLine)) {
      continue;
    }

    bodyBlocks.push(block);
  }

  const bodyMarkdown = bodyBlocks.join("\n\n").trim();

  return {
    title,
    bodyMarkdown,
    copyMarkdown: `# ${title}\n\n${bodyMarkdown}`.trim(),
  };
}

const articles = [
  {
    id: "reddit",
    platform: "Reddit",
    language: "English",
    badge: "Market data workflow",
    source: "01-reddit-ai-market-data-justin-v2.md",
    cover: "graphics/01-reddit-cover.png",
    infographic: "graphics/01-reddit-infographic.png",
  },
  {
    id: "xueqiu",
    platform: "雪球",
    language: "简体中文",
    badge: "AI screening workflow",
    source: "02-xueqiu-ai-screening-justin-v2.md",
    cover: "graphics/02-xueqiu-cover.png",
    infographic: "graphics/02-xueqiu-infographic.png",
  },
  {
    id: "x",
    platform: "X / Twitter",
    language: "English",
    badge: "Earnings workflow",
    source: "03-x-earnings-workflow-thread-justin-v2.md",
    cover: "graphics/03-x-cover.png",
    infographic: "graphics/03-x-infographic.png",
  },
].map((article) => {
  const markdown = fs.readFileSync(path.join(__dirname, article.source), "utf8").trim();
  return {
    ...article,
    ...extractCopywriting(markdown, article.id),
  };
});

const publicArticles = articles.map(({ source, ...article }) => article);

const retroComicReferences = [
  {
    id: "retro-reddit-cover",
    article: "Reddit",
    type: "Cover",
    ratio: "3:4",
    image: "graphics-aigym-style/01-reddit-cover.png",
  },
  {
    id: "retro-reddit-infographic",
    article: "Reddit",
    type: "Infographic",
    ratio: "16:9",
    image: "graphics-aigym-style/01-reddit-infographic.png",
  },
  {
    id: "retro-xueqiu-cover",
    article: "雪球",
    type: "Cover",
    ratio: "3:4",
    image: "graphics-aigym-style/02-xueqiu-cover.png",
  },
  {
    id: "retro-xueqiu-infographic",
    article: "雪球",
    type: "Infographic",
    ratio: "16:9",
    image: "graphics-aigym-style/02-xueqiu-infographic.png",
  },
  {
    id: "retro-x-cover",
    article: "X / Twitter",
    type: "Cover",
    ratio: "3:4",
    image: "graphics-aigym-style/03-x-cover.png",
  },
  {
    id: "retro-x-infographic",
    article: "X / Twitter",
    type: "Infographic",
    ratio: "16:9",
    image: "graphics-aigym-style/03-x-infographic.png",
  },
];

const html = String.raw`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Article showcase from DeptAI</title>
    <style>
      :root {
        color-scheme: light;
        --ink: #17202a;
        --muted: #5c6670;
        --line: #d7dde3;
        --paper: #f7f3ec;
        --panel: #ffffff;
        --accent: #0f7b6c;
        --accent-2: #c94837;
        --accent-3: #1f5f99;
        --soft: #e9f3ef;
        --shadow: 0 20px 70px rgba(23, 32, 42, 0.12);
      }

      * {
        box-sizing: border-box;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        margin: 0;
        color: var(--ink);
        background:
          linear-gradient(180deg, rgba(15, 123, 108, 0.10), rgba(255, 255, 255, 0) 360px),
          var(--paper);
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans TC", "Noto Sans SC", sans-serif;
        line-height: 1.6;
      }

      a {
        color: inherit;
      }

      .shell {
        width: min(1180px, calc(100% - 32px));
        margin: 0 auto;
      }

      .hero {
        min-height: 82vh;
        display: grid;
        grid-template-columns: minmax(0, 1.03fr) minmax(320px, 0.97fr);
        gap: clamp(28px, 5vw, 72px);
        align-items: center;
        padding: 38px 0 44px;
      }

      h1 {
        max-width: 780px;
        margin: 0;
        font-size: clamp(3rem, 7vw, 6.25rem);
        line-height: 0.92;
        letter-spacing: 0;
      }

      .hero-copy {
        max-width: 680px;
        margin-top: 26px;
        color: #39444e;
        font-size: clamp(1.05rem, 2vw, 1.35rem);
      }

      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        margin-top: 34px;
      }

      .button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 10px 16px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        color: var(--ink);
        font-weight: 750;
        text-decoration: none;
        box-shadow: 0 8px 30px rgba(23, 32, 42, 0.08);
      }

      .button.primary {
        border-color: var(--accent);
        background: var(--accent);
        color: #fff;
      }

      .hero-media {
        position: relative;
        min-height: 560px;
      }

      .cover-stack {
        position: relative;
        width: min(100%, 520px);
        margin-left: auto;
      }

      .cover-card {
        position: absolute;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.76);
        border-radius: 8px;
        background: #fff;
        box-shadow: var(--shadow);
      }

      .cover-card img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .cover-card.primary {
        position: relative;
        width: 64%;
        aspect-ratio: 3 / 4;
        margin-left: auto;
        z-index: 3;
      }

      .cover-card.secondary {
        left: 0;
        top: 78px;
        width: 49%;
        aspect-ratio: 3 / 4;
        z-index: 2;
      }

      .cover-card.tertiary {
        right: 12%;
        bottom: -102px;
        width: 53%;
        aspect-ratio: 16 / 9;
        z-index: 4;
      }

      .nav-band {
        position: sticky;
        top: 0;
        z-index: 20;
        border-top: 1px solid var(--line);
        border-bottom: 1px solid var(--line);
        background: rgba(247, 243, 236, 0.92);
        backdrop-filter: blur(16px);
      }

      .nav-inner {
        display: flex;
        gap: 10px;
        overflow-x: auto;
        padding: 12px 0;
        scrollbar-width: none;
      }

      .nav-inner::-webkit-scrollbar {
        display: none;
      }

      .nav-pill {
        flex: 0 0 auto;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        min-height: 42px;
        padding: 9px 13px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: var(--panel);
        color: var(--ink);
        font-weight: 760;
        text-decoration: none;
        white-space: nowrap;
      }

      .nav-pill span {
        color: var(--muted);
        font-size: 0.86rem;
        font-weight: 650;
      }

      .section-heading {
        margin: 72px 0 28px;
        display: flex;
        align-items: end;
        justify-content: space-between;
        gap: 24px;
      }

      .section-heading h2 {
        margin: 0;
        font-size: clamp(2rem, 4vw, 3.5rem);
        line-height: 1;
        letter-spacing: 0;
      }

      .section-heading p {
        max-width: 460px;
        margin: 0;
        color: var(--muted);
      }

      .article {
        display: grid;
        grid-template-columns: minmax(300px, 0.82fr) minmax(0, 1.18fr);
        gap: clamp(22px, 4vw, 50px);
        align-items: start;
        padding: 46px 0 76px;
        border-top: 1px solid var(--line);
      }

      .article-media {
        position: sticky;
        top: 84px;
        display: grid;
        gap: 14px;
      }

      .image-frame {
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 12px 45px rgba(23, 32, 42, 0.10);
      }

      .image-frame img {
        display: block;
        width: 100%;
        height: auto;
      }

      .image-caption {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 10px;
        padding: 10px 12px;
        color: var(--muted);
        font-size: 0.85rem;
        font-weight: 680;
      }

      .style-reference {
        padding: 8px 0 78px;
      }

      .style-intro {
        max-width: 760px;
        margin: 0 0 26px;
        color: #39444e;
        font-size: 1.05rem;
      }

      .style-grid {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 16px;
      }

      .style-card {
        overflow: hidden;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        box-shadow: 0 12px 42px rgba(23, 32, 42, 0.09);
      }

      .style-card img {
        display: block;
        width: 100%;
        height: auto;
      }

      .style-card.wide {
        grid-column: span 2;
      }

      .article-panel {
        border: 1px solid var(--line);
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.82);
        box-shadow: 0 16px 60px rgba(23, 32, 42, 0.08);
      }

      .article-top {
        display: flex;
        align-items: start;
        justify-content: space-between;
        gap: 16px;
        padding: 20px;
        border-bottom: 1px solid var(--line);
      }

      .article-kicker {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 12px;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        min-height: 28px;
        padding: 4px 9px;
        border-radius: 999px;
        background: var(--soft);
        color: #145f55;
        font-size: 0.78rem;
        font-weight: 800;
      }

      .tag.alt {
        background: #f6e9e3;
        color: #8f3428;
      }

      .article-title {
        margin: 0;
        font-size: clamp(1.5rem, 3vw, 2.35rem);
        line-height: 1.08;
        letter-spacing: 0;
      }

      .copy-button {
        flex: 0 0 auto;
        min-height: 38px;
        padding: 8px 11px;
        border: 1px solid var(--line);
        border-radius: 8px;
        background: #fff;
        color: var(--ink);
        cursor: pointer;
        font: inherit;
        font-size: 0.86rem;
        font-weight: 800;
      }

      .rendered {
        padding: 26px clamp(18px, 4vw, 40px) 34px;
      }

      .rendered h2,
      .rendered h3 {
        margin: 34px 0 12px;
        line-height: 1.15;
        letter-spacing: 0;
      }

      .rendered h2 {
        font-size: 1.35rem;
      }

      .rendered h3 {
        color: var(--accent-3);
        font-size: 1.05rem;
      }

      .rendered p {
        margin: 0 0 16px;
      }

      .rendered ul,
      .rendered ol {
        margin: 0 0 18px;
        padding-left: 1.4rem;
      }

      .rendered li {
        margin: 6px 0;
      }

      .rendered .source-title {
        margin: 0 0 18px;
        color: var(--accent);
        font-size: 1.05rem;
        font-weight: 850;
      }

      .rendered .label-line {
        color: var(--muted);
        font-weight: 760;
      }

      details {
        border-top: 1px solid var(--line);
        background: #fbfaf7;
      }

      summary {
        cursor: pointer;
        padding: 15px 20px;
        font-weight: 820;
      }

      pre {
        margin: 0;
        overflow: auto;
        padding: 0 20px 24px;
        color: #29323b;
        white-space: pre-wrap;
        font: 0.92rem/1.55 ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace;
      }

      .footer {
        padding: 50px 0 58px;
        border-top: 1px solid var(--line);
        color: var(--muted);
      }

      @media (max-width: 900px) {
        .hero,
        .article {
          grid-template-columns: 1fr;
        }

        .hero {
          min-height: auto;
          padding-top: 30px;
        }

        .hero-media {
          min-height: 420px;
        }

        .cover-stack {
          margin: 0 auto;
        }

        .article-media {
          position: static;
          grid-template-columns: 0.75fr 1fr;
          align-items: start;
        }

        .style-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .style-card.wide {
          grid-column: span 1;
        }

        .section-heading {
          display: block;
        }

        .section-heading p {
          margin-top: 12px;
        }
      }

      @media (max-width: 640px) {
        .shell {
          width: min(100% - 22px, 1180px);
        }

        h1 {
          font-size: clamp(2.65rem, 16vw, 4.2rem);
        }

        .hero-media {
          min-height: 340px;
        }

        .article {
          padding: 34px 0 58px;
        }

        .article-media {
          grid-template-columns: 1fr;
        }

        .article-top {
          display: block;
        }

        .copy-button {
          margin-top: 16px;
          width: 100%;
        }

        .style-grid {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="shell hero">
        <div>
          <h1>Article showcase from DeptAI</h1>
          <p class="hero-copy">Three platform-ready articles for review and feedback. Each section shows the exact copywriting with the generated cover and infographic.</p>
          <div class="hero-actions">
            <a class="button primary" href="#articles">View articles</a>
            <a class="button" href="#retro-comic-style">Retro comic style</a>
          </div>
        </div>
        <div class="hero-media" aria-hidden="true">
          <div class="cover-stack">
            <figure class="cover-card secondary"><img src="graphics/02-xueqiu-cover.png" alt="" /></figure>
            <figure class="cover-card primary"><img src="graphics/01-reddit-cover.png" alt="" /></figure>
            <figure class="cover-card tertiary"><img src="graphics/03-x-infographic.png" alt="" /></figure>
          </div>
        </div>
      </section>

      <nav class="nav-band" aria-label="Article navigation">
        <div class="shell nav-inner" id="nav"></div>
      </nav>

      <section class="shell" id="articles">
        <div class="section-heading">
          <h2>Exact copywriting with assets</h2>
          <p>Rendered for reading, with a clean copy block available under each article.</p>
        </div>
        <div id="article-list"></div>
      </section>

      <section class="shell style-reference" id="retro-comic-style">
        <div class="section-heading">
          <h2>Retro comic style reference</h2>
          <p>One extra image direction for feedback, shown as a complete set across all three articles.</p>
        </div>
        <p class="style-intro">This option uses bold ink outlines, flat poster shapes, halftone texture, paper grain, and a limited aqua / coral / cream palette. It is more editorial and playful than the main style.</p>
        <div class="style-grid" id="retro-comic-list"></div>
      </section>
    </main>

    <footer class="shell footer">
      Built from DeptAI article drafts. Re-run <code>node build-site.mjs</code> after editing the Markdown files.
    </footer>

    <script type="application/json" id="article-data">${JSON.stringify(publicArticles).replace(/</g, "\\u003c")}</script>
    <script type="application/json" id="retro-comic-data">${JSON.stringify(retroComicReferences).replace(/</g, "\\u003c")}</script>
    <script>
      const articles = JSON.parse(document.getElementById("article-data").textContent);
      const retroComicReferences = JSON.parse(document.getElementById("retro-comic-data").textContent);

      const escapeHtml = (value) =>
        value.replace(/[&<>"']/g, (char) => ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char]);

      function renderMarkdown(markdown) {
        const blocks = markdown.split(/\n{2,}/);
        return blocks.map((block) => {
          const lines = block.split("\n");
          const firstLine = lines[0] || "";

          if (firstLine.startsWith("# ")) {
            return '<div class="source-title">' + escapeHtml(firstLine.replace(/^#\s+/, "")) + "</div>";
          }

          if (firstLine.startsWith("## ")) {
            return "<h2>" + escapeHtml(firstLine.replace(/^##\s+/, "")) + "</h2>";
          }

          if (firstLine.startsWith("### ")) {
            return "<h3>" + escapeHtml(firstLine.replace(/^###\s+/, "")) + "</h3>";
          }

          if (lines.every((line) => /^-\s+/.test(line))) {
            return "<ul>" + lines.map((line) => "<li>" + escapeHtml(line.replace(/^-\s+/, "")) + "</li>").join("") + "</ul>";
          }

          if (lines.every((line) => /^\d+\.\s+/.test(line))) {
            return "<ol>" + lines.map((line) => "<li>" + escapeHtml(line.replace(/^\d+\.\s+/, "")) + "</li>").join("") + "</ol>";
          }

          return "<p>" + escapeHtml(block).replace(/\n/g, "<br />") + "</p>";
        }).join("");
      }

      function articleTemplate(article) {
        return [
          '<article class="article" id="' + article.id + '">',
          '<aside class="article-media" aria-label="' + escapeHtml(article.platform) + ' images">',
          '<figure class="image-frame">',
          '<img src="' + article.cover + '" alt="' + escapeHtml(article.platform) + ' cover image" loading="eager" />',
          '<figcaption class="image-caption"><span>Cover</span><span>3:4</span></figcaption>',
          '</figure>',
          '<figure class="image-frame">',
          '<img src="' + article.infographic + '" alt="' + escapeHtml(article.platform) + ' infographic" loading="eager" />',
          '<figcaption class="image-caption"><span>Infographic</span><span>16:9</span></figcaption>',
          '</figure>',
          '</aside>',
          '<section class="article-panel">',
          '<header class="article-top">',
          '<div>',
          '<div class="article-kicker">',
          '<span class="tag">' + escapeHtml(article.platform) + '</span>',
          '<span class="tag alt">' + escapeHtml(article.language) + '</span>',
          '<span class="tag">' + escapeHtml(article.badge) + '</span>',
          '</div>',
          '<h2 class="article-title">' + escapeHtml(article.title) + '</h2>',
          '</div>',
          '<button class="copy-button" type="button" data-copy="' + article.id + '">Copy Copywriting</button>',
          '</header>',
          '<div class="rendered">' + renderMarkdown(article.bodyMarkdown) + '</div>',
          '<details>',
          '<summary>Exact copywriting</summary>',
          '<pre>' + escapeHtml(article.copyMarkdown) + '</pre>',
          '</details>',
          '</section>',
          '</article>',
        ].join("");
      }

      document.getElementById("nav").innerHTML = articles.map((article) =>
        '<a class="nav-pill" href="#' + article.id + '">' + escapeHtml(article.platform) + ' <span>' + escapeHtml(article.badge) + '</span></a>'
      ).join("");

      document.getElementById("article-list").innerHTML = articles.map(articleTemplate).join("");
      document.getElementById("retro-comic-list").innerHTML = retroComicReferences.map((item) => [
        '<figure class="style-card ' + (item.type === "Infographic" ? "wide" : "") + '">',
        '<img src="' + item.image + '" alt="' + escapeHtml(item.article + " " + item.type + " retro comic style reference") + '" loading="eager" />',
        '<figcaption class="image-caption"><span>' + escapeHtml(item.article + " " + item.type) + '</span><span>' + escapeHtml(item.ratio) + '</span></figcaption>',
        '</figure>',
      ].join("")).join("");

      document.addEventListener("click", async (event) => {
        const button = event.target.closest("[data-copy]");
        if (!button) return;
        const article = articles.find((item) => item.id === button.dataset.copy);
        if (!article) return;
        await navigator.clipboard.writeText(article.copyMarkdown);
        const originalText = button.textContent;
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = originalText;
        }, 1400);
      });
    </script>
  </body>
</html>
`;

fs.writeFileSync(path.join(__dirname, "index.html"), html);
console.log("Generated content-drafts/justin-v2/index.html");
