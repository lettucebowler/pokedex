<script lang="ts">
	import '../app.css';
</script>

<div class="mx-auto flex w-full max-w-screen-xl flex-auto flex-col flex-col gap-4 px-1 pb-1">
	<div class="border-b border-x border-default-300 rounded-b-2xl bg-default-200 px-1 pb-1">
		<nav class="py-4 text-center bg-default-100 rounded-b-xl">
			<a href="/"><span class="font-medium text-4xl">Lettuce Pokedex</span></a>
		</nav>
	</div>
	<slot />
</div>

<style>
	:global(html) {
		scrollbar-gutter: stable both-edges;
	}
</style>
