<script>
  import Aix from "./routes/aix.svelte";
  import Vrak from "./routes/vrak.svelte";

  let selectedRoute = 'vrak';

</script>

<nav>
  <button id="vrak" on:click={() => selectedRoute = 'vrak'}>🚽</button>
  <button id="aix" on:click={() => selectedRoute = 'aix'}>🐀</button>
</nav>

{#if selectedRoute === 'vrak'}
  <Vrak />
{:else if selectedRoute === 'aix'}
  <Aix />
{/if}

<style>
  nav {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
  }

  button {
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    margin: 0 0.5rem;
    cursor: pointer;
  }

  #vrak {
    background-color: #3f9f52;
    border: 1px solid white;
  }

  #aix {
    background-color: #000000;
    border: 1px solid yellow;
  }

  button:hover {
    background-color: #555a64;
    color: #fff;
  }
</style>