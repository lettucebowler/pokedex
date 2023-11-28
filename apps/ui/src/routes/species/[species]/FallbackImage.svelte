<script lang="ts">
	import { onMount } from 'svelte';

	let className: string = '';
	export { className as class };
	export let alt = '';
	export let src = '';
	export let fallback = '';

	onMount(() => {
		setTimeout(() => {
			if (!img.naturalWidth && !img.naturalHeight) {
				handleFallback();
			}
		}, 250);
	});

	const handleFallback = () => {
		src = fallback;
	};

	let img: HTMLImageElement;
</script>

<img {src} class={className} {alt} bind:this={img} loading="lazy" />
