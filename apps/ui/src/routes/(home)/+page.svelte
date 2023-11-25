<script lang="ts">
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';

	export let data;
</script>

<svelte:head>
	<title>Lettuce Pokedex</title>
</svelte:head>
<h1 class="text-center text-3xl font-medium">Pokemon by national dex order</h1>
<div class="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
	{#each data.species as species, i (species)}
		<a href={species.name}>
			<figure class="flex flex-col items-center rounded-xl p-1 text-lg font-bold hover:bg-gray-200">
				<img
					class="pixelated h-[96px] w-[96px] sm:h-[192px] sm:w-[192px]"
					src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{species.id}.png"
					alt={species.name}
					loading={i < 30 ? 'eager' : 'lazy'}
				/>
				<figcaption class="text-center capitalize">
					<div class="text-base font-medium">{species.name}</div>
					<div class="text-sm text-gray-700">#{i + 1}</div>
				</figcaption>
			</figure>
		</a>
	{/each}
</div>
