import { UPLOAD_PATH } from "$env/static/private";
import { json } from "@sveltejs/kit";
import * as fs from "fs";

export async function POST({ request }) {
  const data = await request.formData();
  const file = data.get("file");

  let ab = await file.arrayBuffer();

  fs.writeFileSync(
    `temp/${file.name}`,
    Buffer.from(ab, (e) => {
      console.log(e);
    })
  );

  return json(`temp/${file.name}`);
}
