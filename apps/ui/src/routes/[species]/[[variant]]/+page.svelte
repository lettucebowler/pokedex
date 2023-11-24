<script lang="ts">
	export let data;
</script>

<div
	class="p-1 bg-[--color-primary-type-200] border-2 border-[--color-secondary-type-300] rounded-[1.375rem]"
>
	<img
		src={data.variant.image}
		alt={data.variant.name}
		class="aspect-square w-[475px] bg-white border-8 border-[--color-primary-type-100] rounded-2xl"
	/>
</div>
