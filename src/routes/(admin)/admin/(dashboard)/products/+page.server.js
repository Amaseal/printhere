import { db } from "$lib/scripts/db";
import * as fs from "fs";
import { UPLOAD_PATH } from "$env/static/private";

export async function load() {
  const products = await db.product.findMany({
    include: {
      category: true,
      quantities: true,
      sizes: true,
      prices: true,
    },
  });

  const categories = await db.category.findMany();
  if (products && categories) {
    return { products, categories };
  } else {
    return { products: false };
  }
}

const save = async ({ request }) => {
  const data = await request.formData();
  const title = data.get("title");
  const slug = data.get("slug");
  const file = data.get("image");
  const description = data.get("description");
  const sizes = data.getAll("size");
  const category = data.get("category");
  const quantities = data.getAll("quantity");
  const prices = data.getAll("price");

  const product = await db.product.create({
    data: {
      title,
      slug,
      description,
      imgUrl: `../images/${slug + "." + file.name.split(".").pop()}`,
      category: {
        connect: {
          id: Number(category),
        },
      },
    },
  });

  const sizeObjects = sizes.map((sizeItem) => ({
    size: sizeItem,
    product: {
      connect: {
        id: product.id,
      },
    },
  }));

  const createdSizes = await Promise.all(
    sizeObjects.map(async (sizeItem) => {
      return await db.size.create({
        data: sizeItem,
      });
    })
  );

  const quantityObjects = quantities.map((quantityItem, index) => ({
    quantity: quantityItem,
    product: {
      connect: {
        id: product.id,
      },
    },
  }));

  const createdQuantities = await Promise.all(
    quantityObjects.map(async (quantityItem) => {
      return await db.quantity.create({
        data: quantityItem,
      });
    })
  );

  // const priceObjects = prices.map((priceItem, index) => ({
  //   price: priceItem,
  //   product: { connect: { id: product.id } },
  //   size: { connect: { id: createdSizes[index].id } },
  //   quantity: { connect: { id: createdQuantities[index].id } },
  // }));

  const priceObjects = createdSizes.flatMap((size, sizeIndex) =>
    createdQuantities.map((quantity, quantityIndex) => {
      const priceIndex = sizeIndex * createdQuantities.length + quantityIndex;
      return {
        size: {
          connect: {
            id: size.id,
          },
        },
        quantity: {
          connect: {
            id: quantity.id,
          },
        },
        product: {
          connect: {
            id: product.id,
          },
        },
        price: prices[priceIndex],
      };
    })
  );

  const createdPrices = await Promise.all(
    priceObjects.map(async (priceItem) => {
      return await db.price.create({
        data: priceItem,
      });
    })
  );

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

const remove = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");

  const product = await db.product.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      prices: true,
    },
  });

  console.log(product);

  const priceObjects = product.prices.map((obj) => obj.id);

  console.log(priceObjects);

  await db.price.deleteMany({
    where: {
      id: { in: priceObjects },
    },
  });

  const path = product.imgUrl.slice(2);

  fs.unlink(`${UPLOAD_PATH}${path}`, (err) => {
    if (err) {
      console.log(err);
    }
  });

  await db.product.delete({
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
  const description = data.get("description");
  const sizes = data.getAll("size");
  const category = data.get("category");
  const quantities = data.getAll("quantity");
  const prices = data.getAll("price");

  const product = await db.category.findUnique({
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

  await db.cproduct.update({
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

export const actions = { save, remove, edit };
