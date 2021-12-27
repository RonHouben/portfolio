<script lang="ts" context="module">
  import { writable } from 'svelte/store'

  export type ThemeStore = Theme
  export type Theme = 'system' | 'light' | 'dark'

  export const themeStore = writable<ThemeStore>('system')
</script>
