<script lang="ts">
	import '../app.css';
</script>

<div class="mx-auto w-full max-w-screen-xl space-y-2 p-1">
	<slot />
</div>

<style>
	:global(html) {
		scrollbar-gutter: stable both-edges;
	}
</style>
