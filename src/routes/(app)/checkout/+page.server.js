import { db } from "$lib/scripts/database";

export const actions = {
  order: async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    console.log("data", data);

    return { success: true };
  },
};
