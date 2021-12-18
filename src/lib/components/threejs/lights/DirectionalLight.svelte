<script lang="ts">
  import {
    DirectionalLightController,
    DirectionalLightControllerOptions
  } from '$lib/controllers/threejs/lights/directional.light.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { onMount } from 'svelte'

  export let options: DirectionalLightControllerOptions

  let directionalLightController: DirectionalLightController | undefined

  onMount(() => {
    if ($sceneStore) {
      directionalLightController = new DirectionalLightController(options)
    }
  })

  $: if (directionalLightController) {
    directionalLightController.update(options)
  }
</script>
