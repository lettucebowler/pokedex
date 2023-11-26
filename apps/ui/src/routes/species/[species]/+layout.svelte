<script lang="ts">
	export let data;

	function leftPad(width: number, number: number): string {
		const padding = Array(width).fill(0).join('');
		return `${(padding + number).slice(-width)}`;
	}

	import { page } from '$app/stores';
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';
	import FallbackImage from './FallbackImage.svelte';

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
		<WhiteBox class="text-center">
			<h1 class="inline text-2xl font-medium capitalize">{data.species.name}</h1>
			<p class="text-sm text-gray-800">
				{data.species.genus}
			</p>
		</WhiteBox>
		<WhiteBox class="hidden sm:grid">
			<div class="grid w-full items-center px-4 text-center font-mono text-xl font-medium">
				#{leftPad(4, data.species.pokedexNumber)}
			</div>
		</WhiteBox>
	</TypeBox>

	<div id="nav-block">
		<nav class="flex justify-between">
			{#each [data.links.previous, data.links.next] as navItem, i (navItem)}
				<a
					href="/species/{navItem.name}"
					class="flex items-center justify-between rounded-lg p-1 text-center hover:bg-gray-200"
					data-after="→"
					data-before="←"
					class:before:content-[attr(data-after)]={i == 1}
					class:after:content-[attr(data-before)]={i == 0}
				>
					<figure class="flex w-32 flex-col items-center">
						<img
							alt={navItem.name}
							src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{navItem.id}.png"
							class="aspect-square h-12 w-12"
						/>
						<figcaption class="text-lg font-medium first-letter:capitalize">
							{navItem.name}
						</figcaption>
					</figure>
				</a>
			{/each}
		</nav>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-[max-content,_1fr]">
		<slot />
		<div id="info-block" class="space-y-4">
			<h2 class="text-center text-2xl font-medium">Species Info</h2>
			<TypeBox class="space-y-2">
				{#if data.species.flavorText.length}
					<WhiteBox class="space-y-2" padding={4}>
						<h3 class="text-center text-xl font-medium capitalize">description</h3>
						{#each data.species.flavorText as flavor (flavor)}
							<p>{flavor}</p>
						{/each}
					</WhiteBox>
				{/if}
				<WhiteBox class="space-y-2 @container" padding={4}>
					<h3 class="text-center text-xl font-medium capitalize">biology</h3>
					<dl
						class="mx-auto grid w-fit grid-cols-[max-content_max-content] gap-x-4 gap-y-2 @sm:grid-cols-[repeat(2,_max-content_max-content)] @md:grid-cols-[repeat(3,_max-content_minmax(min-content,_1fr))]"
					>
						{#each [{ label: 'habitat', value: data.species.habitat }, { label: 'height', value: `${$page.data.variant.height}m` }, { label: 'weight', value: `${$page.data.variant.weight}kg` }, { label: 'color', value: data.species.color }, { label: 'shape', value: data.species.shape }, { label: 'egg groups', value: data.species?.eggGroups?.join(', ') }].filter((item) => item.value) as item (item)}
							<dt class="text-sm capitalize">{item.label}:</dt>
							<dd class="break-normal text-sm font-bold capitalize">{item.value}</dd>
						{/each}
					</dl>
				</WhiteBox>
			</TypeBox>
			{#if data.species.variants.length && data.species.variants.length > 1}
				<TypeBox class="">
					<WhiteBox class="space-y-2" padding={4}>
						<h3 class="text-center text-xl font-medium capitalize">Variants</h3>
						<nav class="flex flex-wrap justify-center justify-around gap-2">
							{#each data.species.variants as variant}
								<a
									href="/species/{data.species.name}{variant.default
										? ''
										: '/' + variant.name.replace(data.species.name, '').slice(1)}"
									class="flex flex-col items-center gap-1 text-center"
								>
									<figure class="max-w-[96px] hover:underline">
										<FallbackImage
											class="pixelated aspect-square min-h-[96px]"
											src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variant.pokemonId}.png`}
											alt={variant.name
												.replace(data.species.name, '')
												.slice(1)
												.split('-')
												.join(' ')}
											fallback={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${data.species.speciesId}.png`}
										/>
										<figcaption class="text-sm font-medium first-letter:capitalize">
											{variant.name.replaceAll('-', ' ')}
										</figcaption>
									</figure>
								</a>
							{/each}
						</nav>
					</WhiteBox>
				</TypeBox>
			{/if}
		</div>
	</div>
</div>
