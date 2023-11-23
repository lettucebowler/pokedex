<script lang="ts">
	export let data;
</script>

<div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
	{#each data.species as species, i (species)}
		<a href={`/species/${species.name}`}>
			<figure class="flex flex-col items-center bg-red-500 p-1 rounded-lg font-bold text-lg gap-1">
				<img
					class="bg-red-300 rounded-md w-full px-auto min-h-[92px] sm:h-[192px] pixelated"
					src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${species.id}.png`}
					alt={species.name}
					loading={i < 30 ? 'eager' : 'lazy'}
				/>
				<figcaption class="bg-white w-full rounded-md p-1 text-center">{species.name}</figcaption>
			</figure>
		</a>
	{/each}
</div>

<style>
	img {
		image-rendering: pixelated;
	}
</style>
