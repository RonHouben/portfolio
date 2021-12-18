<script lang="ts">
  import {
    PerspectiveCameraAnimateFunction,
    PerspectiveCameraController,
    PerspectiveCameraControllerOptions
  } from '$lib/controllers/threejs/cameras/perspective.camera.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { onMount } from 'svelte'

  export let options: PerspectiveCameraControllerOptions
  export let animate: PerspectiveCameraAnimateFunction | undefined = undefined

  let cameraController: PerspectiveCameraController

  onMount(() => {
    if ($sceneStore) {
      cameraController = new PerspectiveCameraController(options)
    }
  })

  $: if (animate && cameraController) {
    animate(cameraController.three, $sceneStore)
  }

  $: cameraController && cameraController.update(options)
</script>
