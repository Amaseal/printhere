import { UPLOAD_PATH } from "$env/static/private";

export async function POST({ request }) {
  const data = await request.formData();
  const file = data.get("file");

  let ab = await file.arrayBuffer();

  writeFileSync(
    `${UPLOAD_PATH}/images/${file.name}`,
    Buffer.from(ab, (e) => {
      console.log(e);
    })
  );

  console.log(file);
  return new Response({ uploaded: true });
}
