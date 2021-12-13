<script lang="ts">
  import {
    RaycasterController,
    RaycasterControllerOptions
  } from '$lib/controllers/threejs/raycaster.controller'
  import { rendererStore } from '$lib/stores/threejs/renderer.store'

  export let options: RaycasterControllerOptions

  $: if ($rendererStore) {
    new RaycasterController(options)
  }
</script>
