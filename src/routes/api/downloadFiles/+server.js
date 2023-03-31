import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";

// ----- GET -----
export async function GET({ url }) {
  const fileUrl = path.normalize(`./${url.searchParams.get("file")}`);
  console.log(fileUrl);
  const fileName = fileUrl.slice(6);
  console.log(fs.existsSync(`/${fileName}`));
  if (!fs.existsSync(`/${fileName}`)) {
    return new Response("not found", { status: 404 });
  }
  const nodejs_rstream = fs.createReadStream(fileName);
  const web_rstream = Readable.toWeb(nodejs_rstream);

  return new Response(web_rstream, {
    headers: {
      "Content-type": "application/octet-stream; charset=utf-8",
      "Content-Disposition": `attachment; filename*="${fileName}"`,
    },
  });
}
