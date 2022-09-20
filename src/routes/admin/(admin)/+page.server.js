import { error, redirect } from "@sveltejs/kit";

export function load({ locals }) {
  if (!locals.user) {
    throw redirect(307, "/admin/login");
  }

  return { data: locals.user };
}
