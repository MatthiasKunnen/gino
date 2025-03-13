<script lang="ts">
	import {getItems, setItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';
	import type {Item} from "$lib/data.interface";
	import {onMount} from "svelte";

	let items = $state<Array<Item>>([]);

	function addItem(): void {
		items.push({
			cost: new Decimal(0),
		});
		setItems(items)
	}

	function remove(index: number) {
		if (index <= 0) {
			return;
		}

		if (items[index] !== undefined) {
			items.splice(index, 1);
			setItems(items);
		}
	}

	function updatePrice(index: number, event: Event) {
		if (event.target == null || !('value' in event.target) || typeof event.target.value !== 'string') {
			return;
		}

		let newValue: Decimal
		try {
			newValue = new Decimal(event.target.value)
		} catch (error) {
			console.error('Failed to convert to decimal.', error)
			event.target.value = '';
			return;
		}

		const item = items[index];
		if (item === undefined) {
			console.error(`Index ${index} is outside items' bounds.`)
			return;
		}

		item.cost = newValue;
		setItems(items);
	}

	onMount(() => {
		items = getItems()
	})
</script>
<a href="/" class="accent">Keer terug</a>
<div class="prices">
	{#each items as item, i}
		<input type="number" onchange="{e => updatePrice(i, e)}" value={item.cost} min="1" step="0.01"/>
		<button class="danger" onclick="{() => remove(i)}">Verwijder</button>
	{/each}
</div>
<button class="accent" onclick="{addItem}">
	Voeg toe
</button>

<style lang="scss">
	.prices {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 1em;
		margin: 1em 0;

		@media (max-width: 499px) {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}
</style>
