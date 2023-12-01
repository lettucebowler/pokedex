<script lang="ts">
	import type { EvolutionChainOutput } from 'schemas/db/schemas';
	import SpeciesLink from './SpeciesLink.svelte';

	export let evolution: EvolutionChainOutput;
</script>

<div class="flex items-center gap-2">
	{#if evolution.evolves_from}
		<span>→</span>
	{/if}
	<SpeciesLink species={evolution.species.name} id={evolution.species.id} />
</div>
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
