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

  product.sizes.sort((a, b) => {
    // Split the size strings into numerical components
    const aSize = a.size.split("x").map(Number);
    const bSize = b.size.split("x").map(Number);

    // Compare the size components
    if (aSize[0] < bSize[0]) {
      return -1;
    }
    if (aSize[0] > bSize[0]) {
      return 1;
    }
    if (aSize[1] < bSize[1]) {
      return -1;
    }
    if (aSize[1] > bSize[1]) {
      return 1;
    }
  });

  product.quantities.sort((a, b) => a.quantity - b.quantity);

  if (product) {
    return { product };
  }

  throw error(494, "No product found");
}
