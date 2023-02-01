import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, '/admin/login');
	}
	return {
		user: locals.user
	};
};
