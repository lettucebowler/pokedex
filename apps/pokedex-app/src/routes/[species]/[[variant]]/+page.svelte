<script lang="ts">
	import type { VariantInfo } from 'schemas/species.js';

	export let data;
	function getDataItems(variant: VariantInfo) {
		return [
			{
				label: 'variant',
				value: variant.name
			}
		];
	}
</script>

<div class="rounded-xl bg-red-300 border-4 border-red-500 p-1">
	<div class="rounded bg-white p-1 flex flex-col gap-2 items-center">
		<img src={data.variant.image} alt={data.variant.name} class="min-w-[475px] min-h-[475px]" />
	</div>
</div>
