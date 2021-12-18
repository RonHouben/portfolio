<script lang="ts">
import { browser } from '$app/env';

  import {
    AmbientLightController,
    AmbientLightControllerOptions
  } from '$lib/controllers/threejs/lights/ambient.light.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte';
  import { onMount } from 'svelte';

  export let options: AmbientLightControllerOptions

  let ambientLightController: AmbientLightController

  onMount(() => {
    if ($sceneStore) {
      ambientLightController = new AmbientLightController(options)
    }
  })

  $: ambientLightController && ambientLightController.update(options)
</script>
