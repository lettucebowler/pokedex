<script lang="ts">
	let className = '';
	export { className as class };
</script>

<div
	class="rounded-[1.375rem] border-4 border-[var(--color-secondary-type-300,_var(--color-default-300,_black))] bg-[var(--color-primary-type-200,_var(--color-default-200,_black))] p-1"
>
	<div
		class="rounded-xl bg-[var(--color-primary-type-100,_var(--color-default-100,_black))] p-1 {className}"
	>
		<slot />
	</div>
</div>
