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
<div
	class="size-sm sm:size-lg sm:pixelated grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
>
	{#each data.species as species, i (species)}
		<!-- <a href="/species/{species.name}">
			<figure class="flex flex-col items-center rounded-xl p-1 text-lg font-bold hover:underline">
					<img
						class="pixelated w-48"
						src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{species.id}.png"
						alt={species.name}
						loading={i < 30 ? 'eager' : 'lazy'}
					/>
				<figcaption class="text-center capitalize">
					<div class="text-lg font-medium">{species.name}</div>
					<div class="text-base text-gray-700 font-light">#{i + 1}</div>
				</figcaption>
			</figure>
		</a> -->
		<SpeciesLink species={species.name} id={species.id} />
	{/each}
</div>
