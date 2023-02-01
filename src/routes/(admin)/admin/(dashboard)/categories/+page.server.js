import { db } from '$lib/scripts/db';
import * as fs from 'fs';
import { UPLOAD_PATH } from '$env/static/private';

export async function load() {
	const categories = await db.category.findMany();
	if (categories) {
		return { categories };
	} else {
		return { categories: false };
	}
}

const save = async ({ request }) => {
	const data = await request.formData();
	const title = data.get('title');
	const slug = data.get('slug');
	const file = data.get('image');

	const fileData = await file.arrayBuffer();
	fs.writeFile(
		`${UPLOAD_PATH}/images/${slug + '.' + file.name.split('.').pop()}`,
		Buffer.from(fileData),
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);

	await db.category.create({
		data: {
			title: title,
			slug: slug,
			imgUrl: `../images/${slug + '.' + file.name.split('.').pop()}`
		}
	});
};

const remove = async ({ request }) => {
	const data = await request.formData();
	const id = data.get('id');

	const category = await db.category.findUnique({
		where: {
			id: Number(id)
		}
	});

	const path = category.imgUrl.slice(2);

	fs.unlink(`${UPLOAD_PATH}${path}`, (err) => {
		if (err) {
			console.log(err);
		}
	});

	await db.category.delete({
		where: {
			id: Number(id)
		}
	});
};

const edit = async ({ request }) => {
	const data = await request.formData();
	const title = data.get('title');
	const slug = data.get('slug');
	const file = data.get('image');
	const id = data.get('id');

	const category = await db.category.findUnique({
		where: {
			id: Number(id)
		}
	});

	const path = category.imgUrl.slice(2);

	fs.unlink(`${UPLOAD_PATH}${path}`, (err) => {
		if (err) {
			console.log(err);
		}
	});

	await db.category.update({
		where: {
			id: Number(id)
		},
		data: {
			title: title,
			slug: slug,
			imgUrl: `../images/${slug + '.' + file.name.split('.').pop()}`
		}
	});

	const fileData = await file.arrayBuffer();
	fs.writeFile(
		`${UPLOAD_PATH}/images/${slug + '.' + file.name.split('.').pop()}`,
		Buffer.from(fileData),
		(err) => {
			if (err) {
				console.log(err);
			}
		}
	);
};

export const actions = { save, remove, edit };
