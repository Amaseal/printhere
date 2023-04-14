import { db } from "$lib/scripts/db";
import { error } from "@sveltejs/kit";

export async function load({ params }) {
  // do some compute on the server
  const product = await db.product.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      category: true,
      quantities: true,
      sizes: true,
      prices: true,
    },
  });

  product.sizes.sort((a, b) => a.price - b.price);
  product.quantities.sort((a, b) => a.quantity - b.quantity);

  if (product) {
    return { product };
  }

  throw error(494, "No product found");
}
