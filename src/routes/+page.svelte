<script lang="ts">
	import {getItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';

	type Item = {cost: Decimal, amount: number}
	const items = $state<Array<Item>>([]);
	for (let item of getItems()) {
		items.push({
			cost: item.cost,
			amount: 0,
		});
	}

	let total = $state(new Decimal(0));

	const add = (val: Item) => {
		val.amount++;
		total = total.plus(val.cost);
	};
	const decrease = (val: Item) => {
		val.amount--;
		total = total.minus(val.cost);
	};
	const clear = () => {
		total = new Decimal(0);
		for (let item of items) {
			item.amount = 0;
		}
	};
</script>
<div class="container">
	<div class="items">
		{#each items as item}
			<div class="item">
				<button onclick={() => add(item)}>
					€ {item.cost}
				</button>
			</div>
		{/each}
	</div>

	<div class="total">
		<p>Total: {total}</p>
		<button class="clear" onclick="{clear}">Clear</button>
	</div>

	<ul class="cart">
		{#each items as item}
			{#if item.amount > 0}
				<li class="cart-item">
					€ {item.cost} × {item.amount} = € {item.cost.times(item.amount)}
					<button onclick={() => decrease(item)}>
						min 1
					</button>
				</li>
			{/if}
		{/each}
	</ul>
	<div class="flex-grow"></div>
	<button class="edit-prices">
		Edit prices
	</button>
</div>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;

		@media (max-width: 999px) {
			flex-direction: column-reverse;
		}
	}

	.items {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 1em 0;
		gap: 1em;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: stretch;
			font-size: 2rem;
		}
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

	.cart {
		margin: 0.5em 0;
		list-style-type: disc;
		list-style-position: inside;
		font-size: 1.2rem;

		.cart-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0.5em 0
		}
	}

	.flex-grow {
		flex-grow: 1;
	}

	.edit-prices {
		align-self: flex-end;
	}
</style>
