<script lang="ts">
	export let data;
</script>

<div
	class="p-1 bg-[--color-primary-type-200] border-2 border-[--color-secondary-type-300] rounded-[1.375rem] mb-auto"
>
	<div class="p-2 bg-[--color-primary-type-100] rounded-2xl">
		<div class="bg-white rounded-lg">
			<img
				src={data.variant.image}
				alt={data.variant.name}
				class="aspect-square w-full sm:w-[320px] md:w-[400px] lg:w-[475px] bg-white rounded-lg"
			/>
			<div class="flex justify-around pb-1 px-1">
				{#each data.variant.types as type, i (type)}
					<div
						class="font-medium text-base text-white p-2 w-full flex-1 text-center"
						class:bg-[--color-primary-type-200]={i === 0}
						class:rounded-l={i === 0}
						class:rounded-r={i === 1 || data.variant.types.length == 1}
						class:bg-[--color-secondary-type-200]={i === 1}
					>
						{type}
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
