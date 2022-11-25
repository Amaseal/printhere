import { db } from "$lib/scripts/database";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  // do some compute on the server
  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      products: true,
    },
  });

  if (category) {
    return { category };
  }

  throw error(494, "No categories found");
}
