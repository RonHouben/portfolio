<script lang="ts">
  import { CannonDebugRenderer } from '$lib/controllers/cannon-es/helpers/debug.renderer.controller'
  import {
    WorldController,
    WorldControllerOptions
  } from '$lib/controllers/cannon-es/world.controller'
  import { sceneStore } from '$lib/stores/threejs/scene.store'
  import { onMount } from 'svelte'

  export let options: Omit<WorldControllerOptions, 'createContactMaterials'> & { helpers?: { enabled: boolean }}
  export let createContactMaterials: WorldControllerOptions['createContactMaterials'] = undefined
  export let createConstraints: WorldControllerOptions['createConstraints'] = undefined

  const worldController = new WorldController({
    ...options,
    createContactMaterials,
    createConstraints
  })

  onMount(() => {
    worldController.renderLoop()

    if (options.helpers?.enabled) {
      const cannonDebugRenderer = new CannonDebugRenderer($sceneStore, worldController.cannon, {
        color: 'green'
      })

      cannonDebugRenderer.renderLoop()
    }
  })
</script>

<slot />
