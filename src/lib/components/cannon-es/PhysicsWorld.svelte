<script lang="ts">
  import { CannonDebugRenderer } from '$lib/controllers/cannon-es/helpers/debug.renderer.controller'
  import { WorldController } from '$lib/controllers/cannon-es/world.controller'
  import { sceneStore } from '$lib/stores/threejs/scene.store'
  import type { WorldOptions } from 'cannon-es'
  import { onMount } from 'svelte'

  export let options: WorldOptions & { debug?: boolean }

  const worldController = new WorldController(options)

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
