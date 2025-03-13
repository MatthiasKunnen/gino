<script lang="ts">
	import type {Snippet} from 'svelte';

	let {
		header,
		okButtonText,
		/**
		 * The value of the input if the dialog was confirmed.
		 */
		valueOut,
		showModal = $bindable(),
	}: {
		header: Snippet,
		okButtonText: string,
		valueOut: (value: string) => void,
		showModal: boolean,
	} = $props();

	let dialog = $state<HTMLDialogElement>();
	let value = $state('')

	function close(cancel = true) {
		dialog?.close();
		if (!cancel) {
			valueOut(value)
		}
	}

	function onDialogClick(e: Event) {
		if (e.target === dialog) {
			close();
		}
	}

	$effect(() => {
		if (showModal) {
			value = '';
			dialog?.showModal();
		}
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={dialog}
	onclose={() => (showModal = false)}
	onclick={onDialogClick}
>
	{@render header?.()}
	<form onsubmit={e => close(false)} id="price-input-form">
		<input type="number" bind:value={value} min="1" step="0.01" required/>
	</form>
	<div class="actions">
		<button class="accent" type="submit" form="price-input-form">{okButtonText}</button>
		<button onclick={() => close()}>Annuleer</button>
	</div>
</dialog>

<style lang="scss">
	dialog {
		max-width: 32em;
		border-radius: 0.2em;
		border: none;
		padding: 0.5em;

		&::backdrop {
			background: rgba(0, 0, 0, 0.3);
		}

		&[open] {
			animation: zoom 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
		}

		::backdrop {
			animation: fade 0.2s ease-out;
		}
	}

	.actions {
		display: flex;
		flex-direction: row-reverse;
		gap: 0.5em;
		margin-top: 1em;
	}

	@keyframes zoom {
		from {
			transform: scale(0.95);
		}
		to {
			transform: scale(1);
		}
	}

	@keyframes fade {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
</style>
