<script lang="ts">
  import type { PhysicsBodyStore } from '$lib/controllers/cannon-es/body.controller.svelte'
  import {
    MeshAnimateFunction,
    MeshController,
    MeshControllerOptions
  } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { getContext } from 'svelte'

  export let options: MeshControllerOptions
  export let animate: MeshAnimateFunction | undefined = undefined

  let meshController: MeshController

  $: if ($sceneStore && !meshController) {
    meshController = new MeshController(options)
  }

  const physicsBodyStore = getContext<PhysicsBodyStore>('physicsBody')

  $: if (meshController) {
    meshController.setPhysicsBody($physicsBodyStore)
  }

  $: if (meshController && options) {
    meshController.updateOptions(options)
  }

  $: if (meshController && animate) {
    meshController.animate(animate)
  }
</script>
