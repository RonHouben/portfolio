<script lang="ts">
  import { browser } from '$app/env'
  import {
    MeshAnimateFunction,
    MeshController,
    MeshControllerOptions
  } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Body } from 'cannon-es'
  import { getContext } from 'svelte'

  export let options: MeshControllerOptions
  export let animate: MeshAnimateFunction | undefined = undefined

  let meshController: MeshController

  if ($sceneStore && browser) {
    meshController = new MeshController({
      ...options,
      interactions: options.interactions,
    })
  }

  $: if (animate && meshController) {
    meshController.animate(animate)
  }

  $: body = getContext<Body>('body')

  $: if (meshController && body) {
    meshController.setPositionFromPhysicsBody(body)
  }
</script>
