<script lang="ts">
  import {
    PerspectiveCameraAnimateFunction,
    PerspectiveCameraController,
    PerspectiveCameraControllerOptions
  } from '$lib/controllers/threejs/cameras/perspective.camera'
  import { sceneStore } from '$lib/stores/threejs/scene.store'

  export let options: PerspectiveCameraControllerOptions
  export let animate: PerspectiveCameraAnimateFunction | undefined = undefined

  const cameraController = new PerspectiveCameraController(options)

  if (animate) {
    animate(cameraController.three, $sceneStore)
  }

  $: cameraController.update(options)
</script>
