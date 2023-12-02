<script lang="ts">
	export let data;

	function leftPad(width: number, number: number): string {
		const padding = Array(width).fill(0).join('');
		return `${(padding + number).slice(-width)}`;
	}

	import { page } from '$app/stores';
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';
	import Evolution from './Evolution.svelte';
	// import Evolution from './Evolution.svelte';
	import FallbackImage from './FallbackImage.svelte';
	import SpeciesLink from './SpeciesLink.svelte';

	const getVars = (types?: string[]) => {
		if (!types) {
			return '';
		}
		let workingTypes = [...types];
		if (workingTypes.length === 1) {
			workingTypes = [...types, ...types];
		}
		return [
			`--color-primary-type-100: var(--color-${workingTypes.at(0)}-100)`,
			`--color-primary-type-200: var(--color-${workingTypes.at(0)}-200)`,
			`--color-primary-type-300: var(--color-${workingTypes.at(0)}-300)`,
			`--color-secondary-type-100: var(--color-${workingTypes.at(1)}-100)`,
			`--color-secondary-type-200: var(--color-${workingTypes.at(1)}-200)`,
			`--color-secondary-type-300: var(--color-${workingTypes.at(1)}-300)`
		].join('; ');
	};
</script>

<div style={getVars($page.data?.variant?.types)} class="grid gap-4">
	<TypeBox class="grid grid-cols-[1fr_2fr] gap-2 sm:grid-cols-[max-content_1fr_max-content]">
		<WhiteBox class="flex-1">
			<a
				href="/"
				class="grid h-full flex-1 items-center rounded-lg bg-white p-1 px-4 text-center text-xl font-medium capitalize"
				>Lettuce Pokedex</a
			>
		</WhiteBox>
		<WhiteBox class="py-1 text-center">
			<h1 class="inline text-2xl font-medium capitalize">{data.species.name}</h1>
			<p class="text-sm text-gray-800">
				{data.species.genus}
			</p>
		</WhiteBox>
		<WhiteBox class="hidden sm:grid">
			<div class="grid w-full items-center px-4 text-center font-mono text-xl font-medium">
				#{leftPad(4, data.species.id)}
			</div>
		</WhiteBox>
	</TypeBox>

	<div id="nav-block">
		<nav class="flex justify-between">
			{#each [data.neighbors.previous, data.neighbors.next] as navItem, i (navItem)}
				<div class="flex flex items-center gap-2">
					{#if i === 1}
						<span class="text-2xl">→</span>
					{/if}
					<SpeciesLink species={navItem.name} id={navItem.id} --size="48px" />
					{#if i === 0}
						<span class="text-2xl">←</span>
					{/if}
				</div>
			{/each}
		</nav>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-[max-content,_1fr]">
		<slot />
		<div id="info-block" class="space-y-4">
			<h2 class="text-center text-2xl font-medium">Species Info</h2>
			<TypeBox class="space-y-2">
				{#if data.species.flavor_text}
					<WhiteBox class="space-y-2 p-4">
						<h3 class="text-center text-xl font-medium capitalize">description</h3>
						<p>{data.species.flavor_text}</p>
					</WhiteBox>
				{/if}
				<WhiteBox class="space-y-2 p-4 @container">
					<h3 class="text-center text-xl font-medium capitalize">biology</h3>
					<dl
						class="mx-auto grid w-fit grid-cols-[max-content_max-content] gap-x-4 gap-y-2 @sm:grid-cols-[max-content_max-content_max-content_max-content] @md:grid-cols-[max-content_minmax(min-content,_1fr)_max-content_minmax(min-content,_1fr)_max-content_minmax(min-content,_1fr)]"
					>
						{#each [{ label: 'habitat', value: data.species.habitat }, { label: 'height', value: `${$page.data.variant.height / 10}m` }, { label: 'weight', value: `${$page.data.variant.weight / 10}kg` }, { label: 'color', value: data.species.color }, { label: 'shape', value: data.species.shape }, { label: 'egg groups', value: data.species.egg_groups.join(', ') }].filter((item) => item.value) as item (item)}
							<dt class="text-sm capitalize">{item.label}:</dt>
							<dd class="break-normal text-sm font-bold capitalize">{item.value}</dd>
						{/each}
					</dl>
				</WhiteBox>
			</TypeBox>
			{#if data.variants.length && data.variants.length > 1}
				<TypeBox class="">
					<WhiteBox class="space-y-2 p-4">
						<h3 class="text-center text-xl font-medium capitalize">Variants</h3>
						<nav class="flex flex-wrap justify-center justify-around gap-2">
							{#each data.variants as variant}
								<SpeciesLink species={data.species.name} id={variant.id} variant={variant.name} />
							{/each}
						</nav>
					</WhiteBox>
				</TypeBox>
			{/if}
			{#if data.evolution_chain.evolutions.length}
				<TypeBox>
					<WhiteBox class="space-y-2 p-4">
						<h3 class="text-center text-xl font-medium capitalize">Evolution</h3>
						<div class="flex justify-center gap-2">
							<Evolution evolution={data.evolution_chain} />
						</div>
					</WhiteBox>
				</TypeBox>
			{/if}
		</div>
	</div>
</div>
