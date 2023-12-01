<script>
	import TypeBox from '$lib/components/TypeBox.svelte';
	import WhiteBox from '$lib/components/WhiteBox.svelte';
</script>

<TypeBox>
	<WhiteBox class="grid h-[3.875rem] items-center">
		<nav class="flex justify-center gap-2">
			<a href="/" class="text-2xl font-medium">Lettuce Pokedex</a>
		</nav>
	</WhiteBox>
</TypeBox>
<slot />
