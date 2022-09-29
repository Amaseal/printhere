import { db } from "$lib/scripts/database";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  // do some compute on the server
  const product = await db.product.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      sizes: true,
      quantities: true,
    },
  });

  if (product) {
    return { product };
  }

  throw error(494, "No product found");
}
