/** @type {import('./$types').RequestHandler} */

import { json } from '@sveltejs/kit';
import { crearMovimiento, listarMovimientos, editarMovimiento, eliminarMovimiento } from '$lib/server/db';

export async function GET({ request }) {
	const datos = await listarMovimientos();

	return json(datos, { status: 200 });
}

export async function POST({ request }) {
	const { monto, fecha, descripcion } = await request.json();

	await crearMovimiento(monto, fecha, descripcion);

	return json('Creado satisfactoriamente', { status: 201 });
}

export async function PUT({ request }) {
	const { id, monto, fecha, descripcion } = await request.json();

	await editarMovimiento(id, monto, fecha, descripcion);

	return json('Editado satisfactoriamente', { status: 300 });
}

export async function DELETE({ request }) {
	const { id } = await request.json();

	console.log(id);

	await eliminarMovimiento(id);

	return json('Eliminado satisfactoriamente', { status: 301 });
}
