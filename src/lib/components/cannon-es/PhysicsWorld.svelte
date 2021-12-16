<script lang="ts">
  import { CannonDebugRenderer } from '$lib/controllers/cannon-es/helpers/debug.renderer.controller'
  import {
    WorldController,
    WorldControllerOptions
  } from '$lib/controllers/cannon-es/world.controller'
  import { sceneStore } from '$lib/stores/threejs/scene.store'
  import { onMount } from 'svelte'

  export let options: Omit<WorldControllerOptions, 'createContactMaterials'> & { debug?: boolean }
  export let createContactMaterials: WorldControllerOptions['createContactMaterials'] = undefined

  const worldController = new WorldController({ ...options, createContactMaterials })

  onMount(() => {
    worldController.renderLoop()

    if (options.debug) {
      const cannonDebugRenderer = new CannonDebugRenderer($sceneStore, worldController.cannon, {
        color: 'green'
      })

      cannonDebugRenderer.renderLoop()
    }
  })
</script>

<slot />
