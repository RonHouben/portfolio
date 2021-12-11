<script lang="ts">
  import { World } from 'cannon-es'
  import type { WorldOptions } from 'cannon-es'
	import { onMount, setContext } from 'svelte';

  export let options: WorldOptions

  const world = new World(options)

  setContext<World>('world', world)

  // Start the simulation loop
  const timeStep = 1 / 60 // seconds

  let lastCallTime: number

  function animate() {
    requestAnimationFrame(animate)

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
  	animate()
	})
</script>

<slot />
