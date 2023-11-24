<script lang="ts">
	export let data;

	function leftPad(width: number, number: number): string {
		const padding = Array(width).fill(0).join('');
		return `${(padding + number).slice(-width)}`;
	}

	import { page } from '$app/stores';

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
	<div
		id="title-block"
		class="rounded-[1.375rem] border-2 border-[--color-secondary-type-300] bg-[--color-primary-type-200] p-1"
	>
		<div class="flex gap-2 rounded-2xl bg-[--color-primary-type-100] p-2">
			<a
				href="/"
				class="grid flex-1 items-center rounded-lg bg-white p-1 px-4 text-center text-xl font-medium capitalize"
				>Lettuce Pokedex</a
			>
			<div class="flex-[3_0_max-content] rounded-lg bg-white p-1 text-center">
				<h1 class="inline text-2xl font-medium capitalize">{data.species.name}</h1>
				<p class="text-sm text-gray-800">
					<span class="text-center text-sm font-medium text-gray-800 sm:hidden">
						#{leftPad(4, data.species.pokedexNumber)}</span
					>
					{data.species.genus}
				</p>
			</div>
			<span
				class="hidden flex-[1_0_max-content] flex-col justify-center rounded-lg bg-white p-1 text-center text-xl font-medium sm:flex"
				>#{leftPad(4, data.species.pokedexNumber)}</span
			>
		</div>
	</div>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-[max-content,_1fr]">
		<slot />

		<div id="info-block" class="flex flex-col gap-2">
			{#if data.species.variants.length && data.species.variants.length > 1}
				<div
					id="variant-block"
					class="rounded-[1.375rem] border-2 border-[--color-secondary-type-300] bg-[--color-primary-type-200] p-1"
				>
					<div class="rounded-2xl border-8 border-[--color-primary-type-100] bg-white p-2">
						<h3 class="text-center text-xl font-medium capitalize">Variants</h3>
						<nav class="flex flex-wrap justify-center gap-2">
							{#each data.species.variants as variant}
								<a
									href={variant.name === data.species.name
										? `/${data.species.name}`
										: `/${data.species.name}/${variant.name
												.replace(data.species.name, '')
												.slice(1)}`}
									class="flex flex-col items-center gap-1 text-center"
								>
									<figure class="max-w-[96px]">
										<img
											class="pixelated aspect-square min-h-[96px]"
											src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variant.pokemonId}.png`}
											alt={variant.name
												.replace(data.species.name, '')
												.slice(1)
												.split('-')
												.join(' ')}
										/>
										<figcaption class="text-sm font-medium first-letter:capitalize">
											{variant.name.replaceAll('-', ' ')}
										</figcaption>
									</figure>
								</a>
							{/each}
						</nav>
					</div>
				</div>
			{/if}
			<h2 class="text-center text-2xl font-medium">Species Info</h2>
			<div
				class="rounded-[1.375rem] border-2 border-[--color-secondary-type-300] bg-[--color-primary-type-200] p-1"
			>
				<div class="space-y-2 rounded-2xl bg-[--color-primary-type-100] p-2">
					<div class="space-y-2 rounded-lg bg-white p-4">
						<h3 class="text-center text-xl font-medium capitalize">description</h3>
						{#each data.species.flavorText as flavor (flavor)}
							<p>{flavor}</p>
						{/each}
					</div>
					<div class="space-y-2 rounded-lg bg-white p-4 @container">
						<h3 class="text-center text-xl font-medium capitalize">biology</h3>
						<dl
							class="mx-auto grid max-w-[max-content] grid-cols-[repeat(2,_max-content)] gap-x-4 gap-y-2 @sm:grid-cols-[repeat(3,_max-content)]"
						>
							{#each [{ label: 'habitat', value: data.species.habitat }, { label: 'height', value: `${$page.data.variant.height}m` }, { label: 'weight', value: `${$page.data.variant.weight}kg` }].filter((item) => item.value) as item (item)}
								<span>
									<dt class="inline text-sm capitalize">{item.label}:</dt>
									<dd class="inline text-sm font-bold capitalize">{item.value}</dd>
								</span>
							{/each}
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
