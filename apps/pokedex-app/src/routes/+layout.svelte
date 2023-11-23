<script lang="ts">
	import '../app.css';
</script>

<div class="mx-auto flex w-full max-w-screen-xl flex-auto flex-col p-1 flex-col gap-1">
	<h1 class="font-medium text-xl">Lettuce Pokedex</h1>
	<slot />
</div>

<style>
	:global(html) {
		scrollbar-gutter: stable both-edges;
	}
</style>
