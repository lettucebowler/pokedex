<script lang="ts">
	import '../app.css';
</script>

<div class="mx-auto flex w-full max-w-screen-xl flex-auto flex-col flex-col gap-4">
	<nav class="py-4 text-center">
		<a href="/"><span class="font-medium text-4xl">Lettuce Pokedex</span></a>
	</nav>
	<slot />
</div>

<style>
	:global(html) {
		scrollbar-gutter: stable both-edges;
	}
</style>
