<script lang="ts">
  import type { WorldOptions } from 'cannon-es'
  import { onMount } from 'svelte'
  import { CannonDebugRenderer } from '../../controllers/cannon-es/helpers/debug.renderer.controller'
  import { sceneStore } from '../../stores/threejs/scene.store'
  import { WorldController } from '../../controllers/cannon-es/world.controller'

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
