<script lang="ts">
    export let data;
</script>

{#each data.species as species (species)}
    <p>{species.name}</p>
{/each}
