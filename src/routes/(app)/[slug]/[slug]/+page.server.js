import { db } from "$lib/scripts/db";

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

  if (product) {
    return { product };
  }

  throw error(494, "No product found");
}
