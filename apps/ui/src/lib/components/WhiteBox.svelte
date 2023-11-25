<script lang="ts">
	export let padding = 2;
	let className = '';
	export { className as class };
</script>

<div class="rounded-lg bg-white p-[--padding] {className}" style="--padding: {padding * 0.25}rem;">
	<slot />
</div>
