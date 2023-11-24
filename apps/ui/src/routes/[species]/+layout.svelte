<script lang="ts">
	export let data;

	function leftPad(width: number, number: number): string {
		const padding = Array(width).fill(0).join('');
		return `${(padding + number).slice(-width)}`;
	}
</script>

<div class="rounded-[22px] border border-default-300 bg-default-200 p-1">
	<div class="flex gap-2 bg-default-100 p-2 rounded-2xl">
		<span
			class="font-medium text-xl bg-white p-1 flex flex-col justify-center flex-[1_0_max-content] text-center rounded-lg"
			>#{leftPad(4, data.species.pokedexNumber)}</span
		>
		<div class="bg-white p-1 rounded-lg flex-[3_0_max-content] text-center">
			<h1 class="inline text-2xl font-medium capitalize">{data.species.name}</h1>
			<p class="text-sm text-gray-800">{data.species.genus}</p>
		</div>
	</div>
</div>

<dl class="grid grid-cols-[max-content,_1fr] gap-x-2 gap-y-1">
	{#each [{ label: 'genus', value: data.species.genus }, { label: 'habitat', value: data.species.habitat }].filter((item) => item.value) as item (item)}
		<dt class="font-bold text-sm capitalize">{item.label}:</dt>
		<dd class="text-sm">{item.value}</dd>
	{/each}
</dl>
<div class="space-y-2">
	{#each data.species.flavorText as flavor (flavor)}
		<p>{flavor}</p>
	{/each}
</div>
{#if data.species.variants.length && data.species.variants.length > 1}
	<h3 class="text-lg font-medium capitalize text-center">Variants</h3>
	<nav class="flex gap-2 justify-center">
		{#each data.species.variants as variant}
			<a
				href={variant.name === data.species.name
					? `/${data.species.name}`
					: `/${data.species.name}/${variant.name.replace(data.species.name, '').slice(1)}`}
				class="text-center flex flex-col items-center gap-1"
			>
				<figure class="max-w-[96px]">
					<img
						class="min-h-[96px] aspect-square"
						src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${variant.pokemonId}.png`}
						alt={variant.name.replace(data.species.name, '').slice(1).split('-').join(' ')}
					/>
					<figcaption class="font-medium text-sm">{variant.name.replaceAll('-', ' ')}</figcaption>
				</figure>
			</a>
		{/each}
	</nav>
{/if}
<slot />
