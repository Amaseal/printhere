import { db } from "$lib/scripts/database";

export async function load() {
  // do some compute on the server
  const data = await db.category.findMany();

  const categories = Object.values(data);

  if (categories) {
    return { categories };
  }

  throw error(494, "No categories found");
}
