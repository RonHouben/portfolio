<script lang="ts">
  import { theme } from '$lib/stores/theme.store'
</script>

<nav>
  <div id="logo">Ron Houben</div>
  <select bind:value={$theme}>
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
  }
</style>
