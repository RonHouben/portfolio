<script lang="ts">
  import {
    MeshAnimateFunction,
    MeshController,
    MeshControllerOptions
  } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: MeshControllerOptions
  export let animate: MeshAnimateFunction | undefined = undefined

  let meshController: MeshController

  $: if ($sceneStore && !meshController) {
    meshController = new MeshController(options)
  }

  $: if (animate && meshController) {
    meshController.animate(animate)
  }
</script>
