import { db } from "$lib/scripts/db";

export async function load({ params }) {
  const category = await db.category.findUnique({
    where: {
      slug: params.slug,
    },
    include: {
      products: {
        orderBy: {
          title: "asc",
        },
      },
    },
  });

  if (category) {
    return { category };
  } else {
    return { category: false };
  }
}
