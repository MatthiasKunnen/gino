import Decimal from 'big.js';

import type {Item} from '$lib/data.interface';

let items = $state<Array<Item>>([
	{cost: Decimal('2.7')},
	{cost: Decimal('3')},
	{cost: Decimal('4.5')},
	{cost: Decimal('7.5')},
]);

export function initStorage() {
	loadStorage();

	$effect(() => {
		$inspect('Updates to items', items);
		localStorage.setItem('items', JSON.stringify(items));
	});
}

function loadStorage() {
	const itemsStorageVal = localStorage.getItem('items');
	if (itemsStorageVal === null) {
		return;
	}

	let parsed: unknown;
	try {
		parsed = JSON.parse(itemsStorageVal);
	} catch {
		return;
	}

	if (parsed == null || !Array.isArray(parsed)) {
		return;
	}

	const array: Array<unknown> = parsed;

	for (const item of array) {
		if (item == null || typeof item !== 'object') {
			return;
		}

		if (!('cost' in item)) {
			return;
		}

		if (typeof item.cost !== 'string') {
			return;
		}

		item.cost = Decimal(item.cost);
	}

	items = array as Array<Item>;
}

export function getItems(): Array<Item> {
	return items;
}

export function setItems(i: Array<Item>) {
	items = i;
}
