<script lang="ts" context="module">
  import { writable } from 'svelte/store'
  import type { WebGLRenderer } from 'three'

  export const rendererStore = writable<WebGLRenderer>()
</script>
