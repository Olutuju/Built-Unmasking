// Minimal static preview server for ./dist —  npm run serve  then open the URL.
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import site from "../site.config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..", site.outDir);
const BASE = site.basePath.replace(/\/$/, "");
const PORT = process.env.PORT || 4321;

const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".ico": "image/x-icon", ".json": "application/json",
};

http
  .createServer((req, res) => {
    let p = decodeURIComponent(req.url.split("?")[0]);
    if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length) || "/";
    let file = path.join(ROOT, p);
    if (p.endsWith("/")) file = path.join(file, "index.html");
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      const alt = path.join(ROOT, p, "index.html");
      file = fs.existsSync(alt) ? alt : path.join(ROOT, "404.html");
      if (!fs.existsSync(file)) { res.writeHead(404); return res.end("Not found"); }
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  })
  .listen(PORT, () => console.log(`▸ Preview: http://localhost:${PORT}${BASE}/`));
