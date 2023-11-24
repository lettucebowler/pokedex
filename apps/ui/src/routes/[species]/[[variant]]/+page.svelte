<script lang="ts">
	import cx from 'classix';

	export let data;

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<svelte:head>
	<title>{capitalize(data.variant.name || 'Lettuce Pokedex')}</title>
</svelte:head>
<div
	class="p-1 bg-[--color-primary-type-200] border-2 border-[--color-secondary-type-300] rounded-[1.375rem] mb-auto"
>
	<div class="p-2 bg-[--color-primary-type-100] rounded-2xl">
		<img
			src={data.variant.image}
			alt={data.variant.name}
			class="aspect-square w-full sm:w-[320px] md:w-[400px] lg:w-[475px] bg-white rounded-t-lg"
		/>
		<div class="flex justify-around pb-1 px-1 bg-white rounded-b-lg">
			{#each data.variant.types as type, i (type)}
				<div
					class={cx(
						'font-medium text-base text-white p-2 w-full flex-1 text-center',
						i === 0 ? 'rounded-l bg-[--color-primary-type-200]' : 'bg-[--color-secondary-type-200]',
						(i === 1 || data.variant.types.length == 1) && 'rounded-r'
					)}
				>
					{type}
				</div>
			{/each}
		</div>
	</div>
</div>
