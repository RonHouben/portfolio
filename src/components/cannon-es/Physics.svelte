<script lang="ts">
  import { World } from 'cannon-es'
  import type { WorldOptions } from 'cannon-es'
	import { onMount, setContext } from 'svelte';
  import { CannonDebugRenderer } from '../../controllers/cannon-es/helpers/CannonDebugRenderer';
  import { sceneStore } from '../../stores/threejs/scene.store';

  export let options: WorldOptions

  // TODO: extract to controller class

  const world = new World(options)
  let cannonDebugRenderer: CannonDebugRenderer


  setContext<World>('world', world)

  // Start the simulation loop
  const timeStep = 1 / 60 // seconds

  let lastCallTime: number

  function animate() {
    requestAnimationFrame(animate)

    cannonDebugRenderer.update()

    const time = performance.now() / 1000 // seconds

    if (!lastCallTime) {
      world.step(timeStep)
    } else {
      const dt = time - lastCallTime
      world.step(timeStep, dt)
    }
    lastCallTime = time
  }

	onMount(() => {
    cannonDebugRenderer = new CannonDebugRenderer($sceneStore, world, { color: 'green' });

  	animate()
	})
</script>

<slot />
