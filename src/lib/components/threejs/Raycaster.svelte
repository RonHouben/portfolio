<script lang="ts">
  import {
    RaycasterController,
    RaycasterControllerOptions
  } from '$lib/controllers/threejs/raycaster.controller.svelte'
import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte';
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'

  export let options: RaycasterControllerOptions

  $: if ($rendererStore && $cameraStore) {
    new RaycasterController(options)
  }
</script>
