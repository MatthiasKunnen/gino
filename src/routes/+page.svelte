<script lang="ts">
	import {getItems} from '$lib/storage.svelte';
	import Decimal from 'big.js';
	import {onMount} from 'svelte';
	import type {Item} from "$lib/data.interface";
	import PriceInputModal from "$lib/components/PriceInputModal.svelte";

	type CartItem = {cost: Decimal, amount: number}
	let items = $state<Array<Item>>([]);
	const cart = $state<Array<CartItem>>([]);
	let total = $state(new Decimal(0));
	let showModal = $state(false);

	const add = (decimal: Decimal) => {
		let added = false;
		for (const cartItem of cart) {
			if (cartItem.cost.eq(decimal)) {
				cartItem.amount++;
				added = true;
				break;
			}
		}

		if (!added) {
			cart.push({
				amount: 1,
				cost: decimal,
			})
		}

		total = total.plus(decimal);
	};
	const addCustom = (value: string) => {
		let decimalValue: Decimal;
		try {
			decimalValue = new Decimal(value);
		} catch (error) {
			console.error('Value could not be parsed as a decimal', error)
			return;
		}
		add(decimalValue);
	}
	const decrease = (cartIndex: number) => {
		const cartItem = cart[cartIndex];
		if (cartItem === undefined) {
			return;
		}

		cartItem.amount--;
		if (cartItem.amount <= 0) {
			cart.splice(cartIndex, 1);
		}

		total = total.minus(cartItem.cost);
	};
	const clear = () => {
		total = new Decimal(0);
		cart.length = 0;
	};
	function showAddModal() {
		showModal = true;
	}

	onMount(() => {
		cart.length = 0;
		items = getItems();
	})
</script>
<div class="container">
	<div class="items">
		{#each items as item (item.cost)}
			<div class="item">
				<button onclick={() => add(item.cost)}>
					€ {item.cost}
				</button>
			</div>
		{/each}
		<div class="item">
			<button onclick={() => showAddModal()}>
				Aangepast
			</button>
		</div>
	</div>

	<div class="total">
		<p>Totaal: € {total}</p>
		<button class="clear" onclick="{clear}">Wis</button>
	</div>

	<ul class="cart">
		{#each cart as item, i (item.cost)}
			<li class="cart-item">
				€ {item.cost} × {item.amount} = € {item.cost.times(item.amount)}
				<button class="decrease" onclick={() => decrease(i)}>
					-1
				</button>
			</li>
		{/each}
	</ul>
	<div class="flex-grow"></div>
	<a class="edit-prices" href="/edit">
		Wijzig prijzen
	</a>
</div>
<PriceInputModal bind:showModal valueOut={addCustom} okButtonText="Voeg toe">
	{#snippet header()}
		<h2 class="price-modal-title">Voeg aangepaste prijs toe</h2>
	{/snippet}
</PriceInputModal>

<style lang="scss">
	.container {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		font-size: clamp(1rem, 7vw, 2rem);

		@media (max-width: 999px) {
			flex-direction: column-reverse;
		}
	}

	.items {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		margin: 0.5em 0;
		gap: 0.5em;

		.item {
			display: flex;
			flex-direction: column;
			justify-content: stretch;
		}
	}

	.total {
		display: flex;
		flex-direction: column;
		align-items: stretch;
		text-align: center;
	}

	.clear {
		display: block;
	}

	.cart {
		margin: 0.5em 0;
		list-style-type: disc;
		list-style-position: inside;
		font-size: 0.7em;

		.cart-item {
			display: flex;
			align-items: center;
			justify-content: space-between;
			margin: 0.5em 0;

			.decrease {
				// Increase touch target on mobile
				min-width: 60px;
			}
		}
	}

	.flex-grow {
		flex-grow: 1;
	}

	.edit-prices {
		align-self: flex-end;
		font-size: 0.8em;
	}
</style>
