<script>
	import { onMount } from 'svelte';

	let modoActualizar = false;
	let total = 0;

	let movimientos = [];
	let id;
	let monto;
	let fecha;
	let descripcion;

	const enviarDatos = async () => {
		const response = await fetch('/movimientos', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ monto, fecha, descripcion })
		});

		if (response.ok) {
			monto = '';
			fecha = '';
			descripcion = '';
			actualizarTabla();
		} else {
		}
	};

	const actualizarDato = async (id, monto, fecha, descripcion) => {
		const response = await fetch('/movimientos', {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id, monto, fecha, descripcion })
		});

		if (response.ok) {
			monto = '';
			fecha = '';
			descripcion = '';
			actualizarTabla();
		} else {
		}
	};

	const eliminarDato = async (id) => {
		const response = await fetch('/movimientos', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ id })
		});

		if (response.ok) {
			actualizarTabla();
		} else {
		}
	};

	const agregarPuntos = (monto) => {
		let montoString = monto.toString();
		let montoConPuntos = '';
		let contador = 0;
		for (let i = montoString.length - 1; i >= 0; i--) {
			montoConPuntos = montoString[i] + montoConPuntos;
			contador++;
			if (contador === 3 && i !== 0) {
				montoConPuntos = '.' + montoConPuntos;
				contador = 0;
			}
		}
		return montoConPuntos;
	};

	const calcularTotal = () => {
		total = 0;
		movimientos.forEach((movimiento) => {
			total += movimiento.monto;
		});
	};

	const actualizarTabla = () => {
		fetch('/movimientos')
			.then((response) => response.json())
			.then((data) => {
				movimientos = data;
				calcularTotal();
			});
	};

	onMount(async () => {
		const response = await fetch('/movimientos');
		if (response.ok) {
			movimientos = await response.json();
			calcularTotal();
		} else {
			// Manejar errores, por ejemplo, mostrar un mensaje de error
		}
	});
</script>

<div class="flex flex-1 flex-col space-y-2 h-screen w-full justify-center items-center py-24">
	<div class="flex flex-row justify-between w-1/2 border-2 px-4 py-4 border-red-300">
		<h1 class="text-3xl">Total:</h1>
		<h1 class="text-3xl">${agregarPuntos(total)}</h1>
	</div>

	<form
		class="flex flex-col border-2 border-red-200 p-8 text-xl w-1/2"
		on:submit|preventDefault={() => {
			if (modoActualizar) {
				actualizarDato(id, monto, fecha, descripcion);
				modoActualizar = false;
			} else {
				enviarDatos();
			}
		}}
	>
		<h2 class="text-3xl pb-6">
			{modoActualizar ? 'Actualizar movimiento:' : 'Agregar movimiento:'}
		</h2>
		<label for="monto">Monto:</label>
		<input class="border-2 border-gray-500" type="number" id="monto" bind:value={monto} />
		<div class="h-4 w-full" />
		<label for="fecha">Fecha:</label>
		<input class="border-2 border-gray-500" type="date" id="fecha" bind:value={fecha} />
		<div class="h-4 w-full" />
		<label for="descripcion">Descripción:</label>
		<textarea class="border-2 border-gray-500" id="descripcion" bind:value={descripcion} />
		<div class="h-4 w-full" />
		<button class="bg-red-400 rounded-lg py-2" type="submit">
			{modoActualizar ? 'Actualizar' : 'Agregar'}
		</button>
	</form>

	<table class="table-auto border-2 border-red-200 text-xl w-1/2">
		<thead class="bg-red-200">
			<tr>
				<th class="px-4 py-2">Monto</th>
				<th class="px-4 py-2">Fecha</th>
				<th class="px-4 py-2">Descripción</th>
				<th class="px-4 py-2">Acciones</th>
			</tr>
		</thead>
		<tbody>
			{#each movimientos as movimiento}
				<tr>
					<td class="border px-4 py-2">${agregarPuntos(movimiento.monto)}</td>
					<td class="border px-4 py-2">{movimiento.fecha}</td>
					<td class="border px-4 py-2">{movimiento.descripcion}</td>
					<td class=" flex justify-around border px-4 py-2">
						<button
							on:click={() => {
								id = movimiento.id;
								monto = movimiento.monto;
								fecha = movimiento.fecha;
								descripcion = movimiento.descripcion;
								modoActualizar = true;
							}}
						>
							<i class="fas fa-edit" />
						</button>
						<button on:click={() => eliminarDato(movimiento.id)}>
							<i class="fas fa-trash-alt" />
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
