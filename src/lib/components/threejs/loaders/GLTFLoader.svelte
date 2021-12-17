<script lang="ts">
  import {
    GLTFLoaderController,
    GLTFLoaderControllerOptions
  } from '$lib/controllers/threejs/loaders/GLTF.loader.controller.svelte'

  export let options: GLTFLoaderControllerOptions

  new GLTFLoaderController(options)
</script>
