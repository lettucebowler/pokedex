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
		<div class="flex gap-2 bg-[--color-primary-type-100] p-2 rounded-2xl">
			<a
				href="/"
				class="bg-white p-1 rounded-lg text-center grid items-center font-medium capitalize text-xl px-4 flex-1"
				>Lettuce Pokedex</a
			>
			<div class="bg-white p-1 rounded-lg flex-[3_0_max-content] text-center">
				<h1 class="inline text-2xl font-medium capitalize">{data.species.name}</h1>
				<p class="text-sm text-gray-800">
					<span class="sm:hidden text-sm font-medium text-center text-gray-800">
						#{leftPad(4, data.species.pokedexNumber)}</span
					>
					{data.species.genus}
				</p>
			</div>
			<span
				class="hidden sm:flex font-medium text-xl bg-white p-1 flex-col justify-center flex-[1_0_max-content] text-center rounded-lg"
				>#{leftPad(4, data.species.pokedexNumber)}</span
			>
		</div>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-[max-content,_1fr] gap-4">
		<slot />

		<div id="info-block" class="flex flex-col gap-2">
			{#if data.species.variants.length && data.species.variants.length > 1}
				<div
					id="variant-block"
					class="border-2 border-[--color-secondary-type-300] p-1 bg-[--color-primary-type-200] rounded-[1.375rem]"
				>
					<div class="bg-white p-2 border-8 border-[--color-primary-type-100] rounded-2xl">
						<h3 class="text-xl font-medium capitalize text-center">Variants</h3>
						<nav class="flex gap-2 justify-center flex-wrap">
							{#each data.species.variants as variant}
								<a
									href={variant.name === data.species.name
										? `/${data.species.name}`
										: `/${data.species.name}/${variant.name
												.replace(data.species.name, '')
												.slice(1)}`}
									class="text-center flex flex-col items-center gap-1"
								>
									<figure class="max-w-[96px]">
										<img
											class="min-h-[96px] aspect-square"
											src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variant.pokemonId}.png`}
											alt={variant.name
												.replace(data.species.name, '')
												.slice(1)
												.split('-')
												.join(' ')}
										/>
										<figcaption class="font-medium text-sm first-letter:capitalize">
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
				class="rounded-[1.375rem] border-2 border-[--color-secondary-type-300] p-1 bg-[--color-primary-type-200]"
			>
				<div class="bg-[--color-primary-type-100] p-2 rounded-2xl space-y-2">
					<div class="rounded-lg p-2 bg-white space-y-2">
						<h3 class="text-center text-xl font-medium capitalize">description</h3>
						{#each data.species.flavorText as flavor (flavor)}
							<p>{flavor}</p>
						{/each}
					</div>
					<div class="rounded-lg p-2 bg-white space-y-2">
						<h3 class="text-center text-xl font-medium capitalize">biology</h3>
						<dl
							class="grid gap-x-4 gap-y-2 grid-cols-[repeat(2,_max-content_1fr)] max-w-[max-content] mx-auto"
						>
							{#each [{ label: 'genus', value: data.species.genus }, { label: 'habitat', value: data.species.habitat }, { label: 'height', value: `${$page.data.variant.height}m` }, { label: 'weight', value: `${$page.data.variant.weight}kg` }].filter((item) => item.value) as item (item)}
								<dt class="inline font-bold text-sm capitalize">{item.label}:</dt>
								<dd class="inline text-sm">{item.value}</dd>
							{/each}
						</dl>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
