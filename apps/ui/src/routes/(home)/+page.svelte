<script lang="ts">
	import SpeciesLink from '$lib/components/SpeciesLink.svelte';
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';

	export let data;
</script>

<svelte:head>
	<title>Lettuce Pokedex</title>
</svelte:head>
<TypeBox>
	<WhiteBox class="grid h-[3.875rem] items-center">
		<nav class="flex justify-center gap-2">
			<a href="/" class="text-2xl font-medium">Lettuce Pokedex</a>
		</nav>
	</WhiteBox>
</TypeBox>
<h1 class="text-center text-3xl font-medium">Pokemon by national dex order</h1>
<div class="sm:pixelated grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
	{#each data.species as species, i (species)}
		<div class="flex hidden justify-center sm:block">
			<SpeciesLink species={species.name} id={species.id} --size="12rem" />
		</div>
		<div class="flex justify-center sm:hidden">
			<SpeciesLink species={species.name} id={species.id} --size="6rem" />
		</div>
	{/each}
</div>
