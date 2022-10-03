import { db } from "$lib/scripts/database";
import { cart } from "$lib/scripts/cart";
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

export const actions = {
  addtocart: async ({ request }) => {
    const data = await request.formData();
    const size = data.get("size");

    const quantity = data.get("quantity");
    const file = data.get("file");
    console.log("data:", data, size, file);
    cart.set((product = { size, quantity }));
  },
};
