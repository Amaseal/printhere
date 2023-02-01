import { db } from '$lib/scripts/db';

export async function load() {
	const categories = await db.category.findMany();
	if (categories) {
		return { categories };
	} else {
		return { categories: false };
	}
}
