<script lang="ts">
	import '../app.css';

	import { page } from '$app/stores';

	const getVars = (types: string[]) => {
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

<div
	class="mx-auto flex w-full max-w-screen-xl flex-auto flex-col flex-col gap-4 p-1"
	style={getVars($page.data.variant.types)}
>
	<slot />
</div>

<style>
	:global(html) {
		scrollbar-gutter: stable both-edges;
	}
</style>
