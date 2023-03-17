import { db } from "$lib/scripts/db";
import * as fs from "fs";
import { UPLOAD_PATH } from "$env/static/private";

export async function load() {
  const orders = await db.order.findMany({
    include: {
      cart: {
        include: {
          cartItems: {
            include: {
              product: true,
              size: true,
              quantity: true,
              price: true,
            },
          },
        },
      },
      customer: true,
    },
  });
  if (orders) {
    return { orders };
  } else {
    return { orders: false };
  }
}

const remove = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const order = await db.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      cart: {
        include: {
          cartItems: true,
        },
      },
    },
  });
  console.log(order);

  // const path = category.imgUrl.slice(2);

  order.cart.cartItems.forEach((item) => {
    fs.unlink(item.file, (err) => {
      if (err) {
        console.log(err);
      }
    });
  });

  await db.order.delete({
    where: {
      id: Number(id),
    },
  });
};

const edit = async ({ request }) => {
  const data = await request.formData();
  const title = data.get("title");
  const slug = data.get("slug");
  const file = data.get("image");
  const id = data.get("id");

  const category = await db.category.findUnique({
    where: {
      id: Number(id),
    },
  });

  const path = category.imgUrl.slice(2);

  fs.unlink(`${UPLOAD_PATH}${path}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await db.category.update({
    where: {
      id: Number(id),
    },
    data: {
      title: title,
      slug: slug,
      imgUrl: `../images/${slug + "." + file.name.split(".").pop()}`,
    },
  });

  const fileData = await file.arrayBuffer();
  fs.writeFile(
    `${UPLOAD_PATH}/images/${slug + "." + file.name.split(".").pop()}`,
    Buffer.from(fileData),
    (err) => {
      if (err) {
        console.log(err);
      }
    }
  );
};

export const actions = { remove, edit };
