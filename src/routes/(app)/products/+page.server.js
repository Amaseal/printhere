import { db } from "$lib/scripts/db";

export async function load() {
  const products = await db.product.findMany();
  if (products) {
    return { products };
  } else {
    return { products: false };
  }
}
