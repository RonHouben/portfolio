<script lang="ts">
  import {
    RaycasterController,
    RaycasterControllerOptions
  } from '$lib/controllers/threejs/raycaster.controller.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'

  export let options: RaycasterControllerOptions

  $: if ($rendererStore) {
    new RaycasterController(options)
  }
</script>
