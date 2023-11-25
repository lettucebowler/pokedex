<script>
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';
</script>

<TypeBox>
	<WhiteBox>
		<nav class="flex justify-center gap-2">
			<a href="/"><span class="text-4xl font-medium">Lettuce Pokedex</span></a>
		</nav>
	</WhiteBox>
</TypeBox>
<slot />
