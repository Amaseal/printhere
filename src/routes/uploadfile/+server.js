import { UPLOAD_PATH } from '$env/static/private';
import { json } from '@sveltejs/kit';
import * as fs from 'fs';

export async function POST({ request }) {
	const data = await request.formData();
	const file = data.get('file');

	let ab = await file.arrayBuffer();

	fs.writeFileSync(
		`${UPLOAD_PATH}/temp/${file.name}`,
		Buffer.from(ab, (e) => {
			console.log(e);
		})
	);

	setTimeout(() => {
		fs.unlinkSync(`${UPLOAD_PATH}/temp/${file.name}`);
		console.log(`File deleted.`);
	}, 50000);

	console.log(file);
	return json(`${UPLOAD_PATH}/temp/${file.name}`);
}
