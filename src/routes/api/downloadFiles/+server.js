import * as fs from "fs";

// ----- GET -----
export async function GET({ params }) {
  console.log({ params });
  const fileUrl = params.file;
  const fileName = fileUrl.slice(6);
  console.log(fileUrl);
  let file = fs.readFile(`./${fileUrl}`);
  console.log(file);

  return new Response(file, {
    status: 200,
    headers: {
      "Content-type": "application/octet-stream; charset=utf-8",
      // "Content-Disposition": `attachment; filename*="${fileName}"`,
    },
  });
}
