import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

const dir = "files/";

/** @type {import('./$types').RequestHandler} */
export async function GET({ params, request }) {
  const file_path = path.normalize(path.join(dir, params.file));

  if (!fs.existsSync(file_path)) {
    return new Response("not found", { status: 404 });
  }

  const stats = fs.statSync(file_path);
  const etag = `W/"${stats.size}-${stats.mtime.getTime()}"`;

  if (request.headers.get("if-none-match") === etag) {
    return new Response(null, { status: 304 });
  }

  const headers = {
    ETag: etag,
    "Content-Type": mimes.lookup(file_path),
    "Content-Length": stats.size,
    "Cache-Control": "max-age=60",
    "Last-Modified": stats.mtime.toUTCString(),
  };

  const nodejs_rstream = fs.createReadStream(file_path);
  const web_rstream = Readable.toWeb(nodejs_rstream);

  return new Response(web_rstream, { headers });
}

const mimes = {
  // Text
  txt: "text/plain",
  pdf: "application/pdf",
  // Images
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  avif: "image/avif",
  // Audio
  mp3: "audio/mp3",
  // Video
  webm: "video/webm",
  mp4: "video/mp4",

  /** @param {string} string */
  lookup(string) {
    const ext = string.trim().toLowerCase().split(".").at(-1);
    return (
      (ext && this[/** @type {keyof typeof mimes} */ (ext)]) ??
      "application/octet-stream"
    );
  },
};
