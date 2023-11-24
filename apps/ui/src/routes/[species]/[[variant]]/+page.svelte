<script lang="ts">
	import cx from 'classix';

	export let data;

	const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
</script>

<svelte:head>
	<title>{capitalize(data.variant.name || 'Lettuce Pokedex')}</title>
</svelte:head>
<div
	class="mb-auto rounded-[1.375rem] border-2 border-[--color-secondary-type-300] bg-[--color-primary-type-200] p-1"
>
	<div class="rounded-2xl bg-[--color-primary-type-100] p-2">
		<img
			src={data.variant.image}
			alt={data.variant.name}
			class="aspect-square w-full rounded-t-lg bg-white sm:w-[320px] md:w-[400px] lg:w-[475px]"
		/>
		<div class="flex justify-around rounded-b-lg bg-white px-1 pb-1">
			{#each data.variant.types as type, i (type)}
				<div
					class={cx(
						'w-full flex-1 p-2 text-center text-base font-medium text-white',
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
