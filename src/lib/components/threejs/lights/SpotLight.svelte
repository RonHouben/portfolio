<script lang="ts">
  import {
    SpotLightAnimateFunction,
    SpotLightController,
    SpotLightControllerOptions
  } from '$lib/controllers/threejs/lights/spot.light.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: Omit<SpotLightControllerOptions, 'scene'>
  export let animate: SpotLightAnimateFunction | undefined = undefined

  let spotLightController: SpotLightController

  $: if ($sceneStore && !spotLightController) {
    spotLightController = new SpotLightController(options)
  }

  $: if (spotLightController && animate) {
    animate(spotLightController.three, $sceneStore)
  }

  $: if (spotLightController && options) {
    spotLightController.updateOptions(options)
  }
</script>
