<script lang="ts">
  import Navbar from '$lib/components/Navbar.svelte'
  import { themeStore } from '$lib/stores/theme.store.svelte'
</script>

<svelte:head>
  <meta name="color-scheme" content={$themeStore === 'system' ? 'light dark' : $themeStore} />
  <link rel="stylesheet" href="styles/global.css" />

  {#if $themeStore === 'system'}
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
  {:else if $themeStore === 'light'}
    <link rel="stylesheet" href="styles/themes/light.css" />
  {:else if $themeStore === 'dark'}
    <link rel="stylesheet" href="styles/themes/dark.css" />
  {/if}

  <title>Ron Houben's Portfolio</title>
</svelte:head>

<main>
  <Navbar />
  <slot />
</main>
