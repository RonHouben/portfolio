<script lang="ts">
  import { themeStore } from '$lib/stores/theme.store.svelte'
</script>

<nav>
  <div id="logo">Ron Houben</div>
  <select bind:value={$themeStore}>
    <option value="system">System</option>
    <option value="light">Light</option>
    <option value="dark">Dark</option>
  </select>
</nav>

<style>
  nav {
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    padding: var(--theme-padding-sm);
    background-color: var(--theme-color-lightest);

    box-shadow: var(--theme-shadow-xs);
  }

  #logo {
    font-weight: bold;
    text-transform: uppercase;
    text-shadow: 0px 1px 0px rgba(0, 0, 0, 0.15), 0px 1px 0.5px rgba(0, 0, 0, 0.1),
      0px 1px 0.5px rgba(0, 0, 0, 0.1);
  }
</style>
