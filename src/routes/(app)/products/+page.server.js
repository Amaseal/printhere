import { db } from "$lib/scripts/db";

export async function load() {
  const products = await db.product.findMany({
    include: {
      sizes: true,
      quantities: true,
      prices: true,
      category: true,
    },
  });
  if (products) {
    return { products };
  } else {
    return { products: false };
  }
}
