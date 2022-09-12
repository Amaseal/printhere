import * as bcrypt from "bcrypt";
import { redirect, invalid } from "@sveltejs/kit";

import { db } from "$lib/scripts/database";

export const actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const username = form.get("username");
    const password = form.get("password");

    if (typeof username !== "string" || typeof password !== "string") {
      return invalid(403, { error: "Something went horribly wrong." });
    }

    if (!username || !password) {
      return invalid(403, { error: "Username and password is required" });
    }

    try {
      await db.user.create({
        data: {
          username,
          passwordHash: await bcrypt.hash(password, 10),
        },
      });

      return { success: "Success." };
    } catch (error) {
      return invalid(403, { error: "User already exist" });
    }
  },
};
