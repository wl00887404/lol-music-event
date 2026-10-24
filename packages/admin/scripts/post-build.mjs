import fs from "fs";
import path from "path";
import { parseArgs } from "util";

// ── CLI 參數解析 ──────────────────────────────────────────────────────────────
const { values: args } = parseArgs({
  options: {
    dist: { type: "string", default: "dist" },
    base: { type: "string", default: "index.html" },
  },
  strict: false,
});

const DIST_DIR = path.resolve(args.dist);
const BASE_HTML = path.join(DIST_DIR, args.base);

// ── 讀取檔案 ─────────────────────────────────────────────────────────────────
if (!fs.existsSync(BASE_HTML)) {
  console.error(`❌  找不到模板檔案：${BASE_HTML}`);
  process.exit(1);
}

const templateHTML = fs.readFileSync(BASE_HTML, "utf-8");

// ── 產生靜態頁面 ──────────────────────────────────────────────────────────────
const finalHTML = templateHTML.replace(/="\/assets\//g, `="/admin/assets/`);
fs.writeFileSync(BASE_HTML, finalHTML, "utf-8");
