<script lang="ts">
  import {
    OrbitControlsController,
    OrbitControlsControllerOptions
  } from '$lib/controllers/threejs/controls/orbit.controls.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: Omit<OrbitControlsControllerOptions, 'domElement'>

  let orbitControlsController: OrbitControlsController

  $: if ($sceneStore) {
    orbitControlsController = new OrbitControlsController($sceneStore, options)
  }

  $: if (orbitControlsController) {
    orbitControlsController.update(options)
  }
</script>

<span />
