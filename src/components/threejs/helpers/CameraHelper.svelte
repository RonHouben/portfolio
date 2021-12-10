<script lang="ts">
  import { onMount } from 'svelte'
  import {
    CameraHelperController,
    CameraHelperControllerOptions
  } from '../../../controllers/threejs/helpers/camera.helper.controller'

  export let options: CameraHelperControllerOptions

  onMount(() => {
    new CameraHelperController(options)
  })
</script>
