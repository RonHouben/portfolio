<script lang="ts" context="module">
  import type { World } from 'cannon-es'
  import { writable } from 'svelte/store'

  export const worldStore = writable<World>()
</script>
