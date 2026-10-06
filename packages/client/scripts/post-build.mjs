/**
 * generate-static-pages.mjs
 *
 * 在 build 後執行，依據路徑 JSON 將 dist/index.html 複製成多份靜態 HTML。
 *
 * 用法：
 *   node generate-static-pages.mjs [options]
 *
 * Options:
 *   --dist   <dir>    build 輸出目錄（預設：dist）
 *   --base   <file>   作為模板的 HTML 檔案，相對於 dist（預設：index.html）
 *   --inject <json>   以 JSON 字串傳入自訂參數，會注入至 <head> 內（選填）
 *
 */

import fs from "fs";
import path from "path";
import { parseArgs } from "util";

/**
 *   - 字串陣列：["/a/b/c", "/about", "/products/item"]
 *   - 物件陣列：[{ "path": "/a/b/c", "params": { "title": "頁面 C" } }, ...]
 *     物件格式可為每條路由個別傳入參數，優先於 --inject 的全域參數
 */

const rawRoutes = [
  "/me",
  "/products",
  "/personal-data-protection",
  "/privacy-policy",
  "/terms-of-service",
  "/honor-roll",
  "/guidelines",
];

// ── CLI 參數解析 ──────────────────────────────────────────────────────────────

const { values: args } = parseArgs({
  options: {
    dist: { type: "string", default: "dist" },
    base: { type: "string", default: "index.html" },
    inject: { type: "string", default: "" },
  },
  strict: false,
});

const DIST_DIR = path.resolve(args.dist);
const BASE_HTML = path.join(DIST_DIR, args.base);

// 全域注入參數（來自 --inject）
let globalParams = {};
if (args.inject) {
  try {
    globalParams = JSON.parse(args.inject);
  } catch {
    console.error(`❌  --inject 的 JSON 格式有誤：${args.inject}`);
    process.exit(1);
  }
}

// ── 讀取檔案 ─────────────────────────────────────────────────────────────────

if (!fs.existsSync(BASE_HTML)) {
  console.error(`❌  找不到模板檔案：${BASE_HTML}`);
  process.exit(1);
}

const templateHTML = fs.readFileSync(BASE_HTML, "utf-8");

// ── 統一路由格式 ──────────────────────────────────────────────────────────────

/**
 * 支援兩種格式：
 *   - 字串："/a/b/c"
 *   - 物件：{ path: "/a/b/c", params: { ... } }
 */
const routes = rawRoutes
  .map((r) => {
    if (typeof r === "string") return { routePath: r, params: {} };
    if (r && typeof r.path === "string")
      return { routePath: r.path, params: r.params ?? {} };
    console.warn(`⚠️  略過無效路由項目：${JSON.stringify(r)}`);
    return null;
  })
  .filter(Boolean);

// ── 參數注入工具 ──────────────────────────────────────────────────────────────

/**
 * 將參數物件轉為 <meta> 與 <script> 標籤並注入至 <head>。
 *
 * 注入內容：
 *   1. <meta name="page-param-{key}" content="{value}">  （方便 SSR / SEO 工具讀取）
 *   2. <script>window.__PAGE_PARAMS__ = { ... };</script>  （供前端 JS 讀取）
 *
 * 若參數為空則不修改 HTML。
 */
function injectParams(html, params) {
  const merged = { ...globalParams, ...params };
  if (Object.keys(merged).length === 0) return html;

  const metaTags = Object.entries(merged)
    .map(
      ([k, v]) =>
        `  <meta name="page-param-${k}" content="${escapeAttr(String(v))}">`,
    )
    .join("\n");

  const scriptTag = `  <script>window.__PAGE_PARAMS__ = ${JSON.stringify(merged, null, 2).replace(/\n/g, "\n  ")};</script>`;

  const injection = `\n${metaTags}\n${scriptTag}\n`;

  // 注入至 </head> 前；若找不到則附加至檔案結尾
  return html.includes("</head>")
    ? html.replace("</head>", `${injection}</head>`)
    : html + injection;
}

function escapeAttr(str) {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

// ── 產生靜態頁面 ──────────────────────────────────────────────────────────────

let created = 0;
let skipped = 0;

for (const { routePath, params } of routes) {
  // 正規化路徑：去除開頭 /，並加上 .html 副檔名
  const normalized = routePath.replace(/^\//, "").replace(/\/$/, "");
  if (!normalized) {
    console.warn(`⚠️  略過根路徑 "/"（dist/index.html 已是根頁面）`);
    skipped++;
    continue;
  }

  const outputFile = path.join(DIST_DIR, `${normalized}.html`);
  const outputDir = path.dirname(outputFile);

  // 建立目錄（含巢狀子目錄）
  fs.mkdirSync(outputDir, { recursive: true });

  // 注入參數後寫入
  const finalHTML = injectParams(templateHTML, params);
  fs.writeFileSync(outputFile, finalHTML, "utf-8");

  console.log(
    `✅  ${routePath}  →  ${path.relative(process.cwd(), outputFile)}`,
  );
  created++;
}

console.log(`\n📄  完成：共產生 ${created} 個頁面，略過 ${skipped} 個。`);
