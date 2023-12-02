<script lang="ts">
	export let species: string;
	export let id: number;
	export let variant = species;
	export let pixelated = false;
</script>

<a
	href="/species/{species}{variant === species ? '' : '/' + variant.replace(species, '').slice(1)}"
	class="flex items-center justify-between rounded-lg p-1 text-center hover:underline before:hover:no-underline hover:after:no-underline"
>
	<figure class="flex w-32 flex-col items-center">
		<img
			alt={species}
			src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/{id}.png"
			class="aspect-square h-[var(--size,_96px)] w-[var(--size,_96px)]"
			class:pixelated
		/>
		<figcaption class="text-lg font-medium first-letter:capitalize">
			{species}
		</figcaption>
	</figure>
</a>
