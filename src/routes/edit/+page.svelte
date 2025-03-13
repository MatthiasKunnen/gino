<script lang="ts">
	import {getItems, setItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';
	import type {Item} from "$lib/data.interface";
	import {onMount} from "svelte";
	import PriceInputModal from "$lib/components/PriceInputModal.svelte";

	let items = $state<Array<Item>>([]);
	let showModal = $state(false);

	function addItem(value: string): void {
		let decimalValue: Decimal;
		try {
			decimalValue = new Decimal(value);
		} catch (error) {
			console.error('Value could not be parsed as a decimal', error)
			return;
		}

		items.push({
			cost: decimalValue,
		});
		setItems(items);
	}

	function showAddModal() {
		showModal = true;
	}

	function remove(index: number) {
		if (index < 0) {
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
<button class="accent" onclick="{showAddModal}">
	Voeg toe
</button>

<PriceInputModal bind:showModal valueOut={addItem} okButtonText="Voeg toe">
	{#snippet header()}
		<h2 class="price-modal-title">Voeg prijs toe</h2>
	{/snippet}
</PriceInputModal>

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

	.price-modal-title {
		text-align: center;
		margin-top: 0.5em;
	}
</style>
