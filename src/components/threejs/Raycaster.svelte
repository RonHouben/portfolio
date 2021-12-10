<script lang="ts">
  import {
    RaycasterController,
    RaycasterControllerOptions
  } from '../../controllers/threejs/raycaster.controller'
  import { rendererStore } from '../../stores/threejs/renderer.store'

  export let options: RaycasterControllerOptions

  $: if ($rendererStore) {
    new RaycasterController(options)
  }
</script>
