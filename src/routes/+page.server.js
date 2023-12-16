/** @type {import('./$types').PageServerLoad} */

import { crearTablas } from '$lib/server/db';

export async function load() {

    crearTablas();

    return {};
};