<script lang="ts">
  import {
    AmbientLightController,
    AmbientLightControllerOptions
  } from '$lib/controllers/threejs/lights/ambient.light.controller.svelte'

  export let options: AmbientLightControllerOptions

  const ambientLightController = new AmbientLightController(options)

  $: ambientLightController.update(options)
</script>
