import { db } from "$lib/scripts/db";
import moment from "moment";
const pastMonths = [];
for (let i = 0; i < 6; i++) {
  const date = moment().subtract(i, "months").format("YYYY-MM");
  pastMonths.push(date);
}

console.log(pastMonths);

//[ '2023-02', '2022-12', '2022-11', '2022-11', '2022-09', '2022-09' ]

export async function load() {
  const orderCount = await db.orderCount.findMany({
    where: {
      month: { in: pastMonths },
    },
  });

  console.log(orderCount);

  const promoCodes = await db.promo.findMany();
  if (promoCodes && orderCount) {
    return { promoCodes, orderCount };
  } else {
    return { categories: false };
  }
}

const save = async ({ request }) => {
  const data = await request.formData();
  const code = data.get("code");
  const amount = data.get("amount");

  await db.promo.create({
    data: {
      code: code,
      amount: Number(amount),
    },
  });
};

const remove = async ({ request }) => {
  const data = await request.formData();
  const id = data.get("id");
  await db.promo.delete({
    where: {
      id: Number(id),
    },
  });
};

export const actions = { save, remove };
