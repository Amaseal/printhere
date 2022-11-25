import * as fs from "fs/promises";

export const actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    let title = data.get("title");
    let slug = data.get("slug");
    const fileData = data.get("file");

    await fs.writeFile(`../images/${fileData.name}`, fileData.stream());

    console.log(title, slug, fileData);
  },
};
