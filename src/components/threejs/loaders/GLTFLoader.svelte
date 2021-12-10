<script lang="ts">
  import {
    GLTFLoaderController,
    GLTFLoaderControllerOptions
  } from '../../../controllers/threejs/loaders/GLTF.loader.controller'

  export let options: GLTFLoaderControllerOptions

  new GLTFLoaderController(options)
</script>
