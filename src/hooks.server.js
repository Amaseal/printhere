import { db } from '$lib/scripts/db';

export const handle = async ({ event, resolve }) => {
	// get cookies from browser
	const session = event.cookies.get('session');

	if (!session) {
		// if there is no session load page as normal
		return await resolve(event);
	}

	// find the user based on the session
	const user = await db.user.findUnique({
		where: { userAuthToken: session }
	});

	// if `user` exists set `events.local`
	if (user) {
		event.locals.user = {
			email: user.email
		};
	}

	// load page as normal
	return await resolve(event);
};
