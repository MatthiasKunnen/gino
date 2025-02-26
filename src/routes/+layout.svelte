<script lang="ts">
	import {afterNavigate} from '$app/navigation';
	import type {Snapshot} from '@sveltejs/kit';
	import {onMount} from 'svelte';

	import './normalize.css';
	import './global.css';
	import {initStorage} from '$lib/storage.svelte';

	let rootContent: HTMLElement;
	let mobileNavOpen = false;
	let lastScrollRestoreTime = 0;

	afterNavigate(() => {
		mobileNavOpen = false;
		if (Date.now() - lastScrollRestoreTime > 500) {
			// Only scroll to top if no restore has been performed. This prevents content from
			// flashing on back button where first, a scroll to top is performed, and then
			// an immediate scroll to content.
			// See https://github.com/sveltejs/kit/issues/10823
			rootContent.scrollTop = 0;
		}
	});

	export const snapshot: Snapshot<number> = {
		capture: () => {
			return rootContent.scrollTop;
		},
		restore: (value) => {
			// Executed before afterNavigate, see https://github.com/sveltejs/kit/issues/10823
			lastScrollRestoreTime = Date.now();
			rootContent.scrollTop = value;
		},
	};

	onMount(() => {
		// Initialize state once at application startup
		initStorage();
	});
</script>

<div class="body" class:mobileNavOpen>
	<div class="root-content" bind:this={rootContent}>
		<slot></slot>
	</div>
</div>

<style>
	.body {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.root-content {
		display: flex;
		flex-direction: column;
		padding: 16px;
		flex-grow: 1;
		overflow: auto;
		scrollbar-gutter: stable both-edges;
	}

	header {
		position: relative;
		z-index: 50;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 4px 8px;
		background-color: var(--accent-color);
	}

	@media (max-width: 599px) {

		.body {
			flex-direction: column-reverse;
		}
	}
</style>
