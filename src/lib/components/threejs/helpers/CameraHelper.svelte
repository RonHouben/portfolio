<script lang="ts">
  import {
    CameraHelperController,
    CameraHelperControllerOptions
  } from '$lib/controllers/threejs/helpers/camera.helper.controller'
  import { onMount } from 'svelte'

  export let options: CameraHelperControllerOptions

  onMount(() => {
    new CameraHelperController(options)
  })
</script>
