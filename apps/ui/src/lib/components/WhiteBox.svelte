<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div class="rounded-lg bg-white {className}">
	<slot />
</div>
