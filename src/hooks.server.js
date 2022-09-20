import { db } from "$lib/scripts/database";

export async function handle({ event, resolve }) {
  const cookies = event.cookies.get("session");

  const session = await db.user.findUnique({
    where: { userAuthToken: cookies },
  });

  if (!session) {
    return await resolve(event);
  }
  if (session) {
    event.locals.user = { username: session.username };
  }

  return await resolve(event);
}

export const getSession = ({ locals }) => {
  if (!locals.user) return {};

  return {
    user: {
      username: locals.user.username,
    },
  };
};
