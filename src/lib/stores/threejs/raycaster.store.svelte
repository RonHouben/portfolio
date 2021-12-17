<script lang="ts" context="module">
  import type { RaycasterController } from '$lib/controllers/threejs/raycaster.controller.svelte'
  import { writable } from 'svelte/store'

  interface RaycasterStore {
    intersects: RaycasterController['intersects']
    raycaster: RaycasterController['three']
  }

  export const raycasterStore = writable<RaycasterStore>()
</script>
