<script lang="ts">
  import {
    SpotLightAnimateFunction,
    SpotLightController,
    SpotLightControllerOptions
  } from '$lib/controllers/threejs/lights/spot.light.controller'
  import { sceneStore } from '$lib/stores/threejs/scene.store'
  import { onMount } from 'svelte'

  export let options: Omit<SpotLightControllerOptions, 'scene'>
  export let animate: SpotLightAnimateFunction | undefined = undefined

  let spotLightController: SpotLightController

  onMount(() => {
    spotLightController = new SpotLightController(options)
  })

  $: if (spotLightController) {
    if (animate) {
      animate(spotLightController.three, $sceneStore)
    }

    spotLightController.update(options)
  }
</script>
