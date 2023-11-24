<script lang="ts">
	export let data;
</script>

<svelte:head>
	<title>Lettuce Pokedex</title>
</svelte:head>
<h1 class="text-3xl font-medium text-center">Pokemon by national dex order</h1>
<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
	{#each data.species as species, i (species)}
		<a href={`${species.name}`}>
			<figure class="flex flex-col items-center font-bold text-lg hover:bg-gray-200 p-1 rounded-xl">
				<img
					class="h-[96px] w-[96px] sm:h-[192px] sm:w-[192px]"
					src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`}
					alt={species.name}
					loading={i < 30 ? 'eager' : 'lazy'}
				/>
				<figcaption class="text-center capitalize">
					<div class="font-medium text-base">{species.name}</div>
					<div class="text-sm text-gray-700">#{i + 1}</div>
				</figcaption>
			</figure>
		</a>
	{/each}
</div>

<style>
	img {
		image-rendering: pixelated;
	}
</style>
