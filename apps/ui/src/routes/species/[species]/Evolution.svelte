<script lang="ts">
	import type { Evolution } from 'schemas/species';

	export let evolution: Evolution;
</script>

<img
	class="pixelated my-auto aspect-square"
	src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{evolution.species
		.id}.png"
	alt={evolution.species.name}
/>
{#if evolution.evolutions.length}
	{#if evolution.evolutions.length > 1}
		<div class="space-y-2">
			{#each evolution.evolutions as evolve}
				<div class="flex">
					<svelte:self evolution={evolve} />
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex">
			<svelte:self evolution={evolution.evolutions.at(0)} />
		</div>
	{/if}
{/if}
