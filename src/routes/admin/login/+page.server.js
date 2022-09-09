import * as bcrypt from "bcrypt";
import { redirect, invalid } from "@sveltejs/kit";
import * as cookie from "cookie";

import { db } from "$lib/scripts/database";

export const actions = {
  default: async ({ cookies, request }) => {
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
      const user = await db.user.findUnique({
        where: { username },
      });

      const passwordMatch =
        user && (await bcrypt.compare(password, user.passwordHash));

      if (!user) {
        return invalid(403, { error: "No user" });
      }

      if (!passwordMatch) {
        return invalid(403, { error: " wrong credendtials" });
      }

      cookies.set(" sesion", user.userAuthToken);

      return { success: "Success" };
    } catch (error) {
      console.log(error);
      return invalid(403, { error: "error" });
    }
  },
};
