<script lang="ts">
  import Vrak from "./routes/vrak.svelte";
  import Pokalrum from "./routes/pokalrum.svelte";

  let route = location.hash;
</script>

<svelte:window on:hashchange={() => (route = location.hash)} />

{#if route === '#/pokalrum'}
  <Pokalrum />
{:else}
  <Vrak />
{/if}
