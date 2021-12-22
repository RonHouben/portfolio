<script lang="ts">
  import {
    AmbientLightController,
    AmbientLightControllerOptions
  } from '$lib/controllers/threejs/lights/ambient.light.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: AmbientLightControllerOptions

  let ambientLightController: AmbientLightController

  $: if ($sceneStore && !ambientLightController) {
    ambientLightController = new AmbientLightController(options)
  }

  $: ambientLightController && ambientLightController.update(options)
</script>
