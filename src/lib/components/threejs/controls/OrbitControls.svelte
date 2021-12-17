<script lang="ts">
  import {
    OrbitControlsController,
    OrbitControlsControllerOptions
  } from '$lib/controllers/threejs/controls/orbit.controls.controller.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'

  export let options: Omit<OrbitControlsControllerOptions, 'domElement'>

  let orbitControlsController: OrbitControlsController

  $: if ($rendererStore) {
    orbitControlsController = new OrbitControlsController(options)
  }

  $: if (orbitControlsController) {
    orbitControlsController.update(options)
  }
</script>

<span />
