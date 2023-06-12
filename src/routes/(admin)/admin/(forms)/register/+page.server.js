import { error, redirect } from "@sveltejs/kit";
import bcrypt from "bcrypt";
import { db } from "$lib/scripts/db";

export const load = async () => {
  // // we only use this endpoint for the api
  // // and don't need to see the page
  // throw redirect(302, "/");
};

const register = async ({ request }) => {
  const data = await request.formData();
  const email = data.get("email");
  const password = data.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    throw error(400, { invalid: true });
  }

  const user = await db.user.findUnique({
    where: { email },
  });

  if (user) {
    throw error(400, { user: true });
  }

  await db.user.create({
    data: {
      email,
      passwordHash: await bcrypt.hash(password, 10),
      userAuthToken: crypto.randomUUID(),
    },
  });

  throw redirect(303, "/admin/login");
};

export const actions = { register };
