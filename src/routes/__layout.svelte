<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte'
  import { theme } from '$lib/stores/theme.store'
</script>

<svelte:head>
  <meta name="color-scheme" content={$theme === 'system' ? 'light dark' : $theme} />
  <link rel="stylesheet" href="styles/global.css" />

  {#if $theme === 'system'}
    <link
      rel="stylesheet"
      href="styles/themes/light.css"
      media="screen and (prefers-color-scheme: light)"
    />
    <link
      rel="stylesheet"
      href="styles/themes/dark.css"
      media="screen and (prefers-color-scheme: dark)"
    />
  {:else if $theme === 'light'}
    <link rel="stylesheet" href="styles/themes/light.css" />
  {:else if $theme === 'dark'}
    <link rel="stylesheet" href="styles/themes/dark.css" />
  {/if}

  <title>Ron Houben's Portfolio</title>
</svelte:head>

<main>
  <Navbar />
  <slot />
</main>