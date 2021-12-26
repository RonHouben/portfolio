<script lang="ts" context="module">
  import { writable } from 'svelte/store'
  import type { PerspectiveCamera } from 'three'

  export const perspectiveCameraStore = writable<PerspectiveCamera>()
</script>
