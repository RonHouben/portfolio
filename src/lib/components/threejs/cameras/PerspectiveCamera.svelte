<script lang="ts">
  import {
    PerspectiveCameraAnimateFunction,
    PerspectiveCameraController,
    PerspectiveCameraControllerOptions
  } from '$lib/controllers/threejs/cameras/perspective.camera.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: PerspectiveCameraControllerOptions
  export let animate: PerspectiveCameraAnimateFunction | undefined = undefined

  let cameraController: PerspectiveCameraController

  $: if ($sceneStore && !cameraController) {
    cameraController = new PerspectiveCameraController($sceneStore, options)
  }

  $: if (animate && cameraController) {
    animate(cameraController.three, $sceneStore)
  }
</script>
