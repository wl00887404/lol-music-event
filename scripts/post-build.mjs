import fs from "fs";
import path from "path";

const root = path.join(import.meta.dirname, "../");
const prodRoot = path.join(root, "../lol-music-event-production");

const tasks = [
  { from: "package.json", to: "package.json" },
  { from: "package-lock.json", to: "package-lock.json" },
  { from: "packages/client/dist", to: "packages/client/dist" },
  { from: "packages/server", to: "packages/server" },
  { from: "packages/admin/dist", to: "packages/admin/dist" },
];

async function copy(from, to) {
  const src = path.join(root, from);
  const dest = path.join(prodRoot, to);

  if (!fs.existsSync(src)) {
    console.warn(`[post-build] 找不到來源 ${from}`);
    return;
  }

  await fs.promises.rm(dest, { recursive: true, force: true });
  await fs.promises.cp(src, dest, { recursive: true, force: true });

  console.log(`[post=build] ${from} -> ${to}`);
}

async function main() {
  for (const { from, to } of tasks) {
    await copy(from, to);
  }
  console.log("[post-build] done.");
}

main().catch((err) => {
  console.error("[post-build] failed:", err);
  process.exit(1);
});
