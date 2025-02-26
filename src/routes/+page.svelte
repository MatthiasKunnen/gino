<script lang="ts">
	import {getItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';
	import type {Item} from '$lib/data.interface';

	let total = $state(new Decimal(0));

	const add = (val: Item) => {
		total = total.plus(val.cost)
	}
	const clear = () => {
		total = new Decimal(0);
	}
</script>

<div class="items">
	{#each getItems() as item}
		<div class="item">
			<button onclick={() => add(item)}>
				{item.cost}
			</button>
		</div>
	{/each}
</div>

<div class="total">
	<p>Total: {total}</p>
	<button class="clear" onclick="{clear}">Clear</button>
</div>


<style>
	button {
		border: 2px solid black;
		border-radius: 4px;
	}

	.items {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin-bottom: 2em;
		gap: 1em;
	}

	.item {
		display: flex;
		flex-direction: column;
		justify-content: stretch;
		font-size: 2rem;
	}

	.item button {
		padding: 0.5em 0.5em;
	}

	.total {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		text-align: center;
		font-size: 2rem;
	}

	.clear {
		display: block;
	}
</style>
