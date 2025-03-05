<script lang="ts">
	import {getItems, setItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';

	let items = getItems();

	function addItem(): void {
		items.push({
			cost: new Decimal(0),
		});
	}

	function moveDown(index: number) {
		if (index >= items.length - 1) {
			return;
		}

		const swapIndex = index + 1;

		if (items[index] !== undefined && items[swapIndex] !== undefined) {
			[items[index], items[swapIndex]] = [items[swapIndex], items[index]];
			items = items
			setItems(items);
		}
	}

	function moveUp(index: number) {
		if (index <= 0) {
			return;
		}
		const swapIndex = index - 1;

		if (items[index] !== undefined && items[swapIndex] !== undefined) {
			[items[index], items[swapIndex]] = [items[swapIndex], items[index]];
			setItems(items);
		}
	}

	function remove(index: number) {
		if (index <= 0) {
			return;
		}

		if (items[index] !== undefined) {
			delete items[index];
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

		if (items[index] === undefined) {
			console.error(`Index ${index} is outside items' bounds.`)
			return;
		}

		items[index].cost = newValue
		setItems(items);
	}
</script>
<a href="/" class="accent">Keer terug</a>
<div class="prices">
	{#each items as item, i}
		<input type="number" onchange="{e => updatePrice(i, e)}" value={item.cost} min="1" step="0.01"/>
		{#if i > 0}
			<button onclick="{() => moveUp(i)}">↑Naar boven</button>
		{:else}
			<span class="empty"></span>
		{/if}
		{#if i < items.length - 1}
			<button onclick="{() => moveDown(i)}">↓Naar beneden</button>
		{:else}
			<span class="empty"></span>
		{/if}
		<button class="danger" onclick="{() => remove(i)}">Verwijder</button>
	{/each}
</div>
<button class="accent" onclick="{addItem}">
	Voeg toe
</button>

<style lang="scss">
	.prices {
		display: grid;
		grid-template-columns: 1fr auto auto auto;
		gap: 1em;
		margin: 1em 0;

		@media (max-width: 599px) {
			grid-template-columns: repeat(3, auto);
			input {
				grid-column: 1 / -1;
			}
		}

		@media (max-width: 399px) {
			grid-template-columns: 1fr;

			.empty {
				display: none;
			}
		}
	}
</style>
