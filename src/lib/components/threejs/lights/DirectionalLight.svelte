<script lang="ts">
  import {
    DirectionalLightController,
    DirectionalLightControllerOptions
  } from '$lib/controllers/threejs/lights/directional.light.controller'
  import { onMount } from 'svelte'

  export let options: DirectionalLightControllerOptions

  let directionalLightController: DirectionalLightController | undefined

  onMount(() => {
    directionalLightController = new DirectionalLightController(options)
  })

  $: if (directionalLightController) {
    directionalLightController.update(options)
  }
</script>
