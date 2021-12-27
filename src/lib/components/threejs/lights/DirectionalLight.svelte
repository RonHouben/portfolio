<script lang="ts">
  import {
    DirectionalLightController,
    DirectionalLightControllerOptions
  } from '$lib/controllers/threejs/lights/directional.light.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: DirectionalLightControllerOptions

  let directionalLightController: DirectionalLightController | undefined

  $: if ($sceneStore && !directionalLightController) {
    directionalLightController = new DirectionalLightController(options)
  }

  $: if (directionalLightController) {
    directionalLightController.updateOptions(options)
  }
</script>
