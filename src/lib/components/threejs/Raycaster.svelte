<script lang="ts">
  import {
    RaycasterController,
    RaycasterControllerOptions
  } from '$lib/controllers/threejs/raycaster.controller.svelte'
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: RaycasterControllerOptions

  let raycasterController: RaycasterController

  $: if ($rendererStore && $sceneStore && $cameraStore && !raycasterController) {
    raycasterController = new RaycasterController($rendererStore, $sceneStore, options)
  }
</script>
