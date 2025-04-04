import Decimal from 'big.js';

import type {Item} from '$lib/data.interface';

let isInitialized = false;
let items: Array<Item> = [
	{cost: Decimal('2.7')},
	{cost: Decimal('3')},
	{cost: Decimal('4.5')},
	{cost: Decimal('7.5')},
];

function loadStorage() {
	if (isInitialized) {
		return;
	}
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
	sortItems();
	isInitialized = true;
}

export function getItems(): Array<Item> {
	loadStorage();
	return [...items];
}

export function setItems(i: Array<Item>) {
	items = [...i];
	sortItems();
	localStorage.setItem('items', JSON.stringify(items));
}

function sortItems(): void {
	items.sort((a, b) => a.cost.gt(b.cost) ? 1 : -1);
}
