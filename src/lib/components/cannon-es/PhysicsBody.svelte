<script lang="ts">
  import {
    PhysicsBody,
    PhysicsBodyController,
    PhysicsBodyControllerOptions
  } from '$lib/controllers/cannon-es/body.controller.svelte'
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { setContext } from 'svelte'
  import { writable } from 'svelte/store'

  export let options: PhysicsBodyControllerOptions

  let physicsBodyController: PhysicsBodyController
  const physicsBodyStore = writable<PhysicsBody>()

  $: if ($physicsWorldStore && $sceneStore && !physicsBodyController) {
    physicsBodyController = new PhysicsBodyController($physicsWorldStore, options)
    physicsBodyStore.set(physicsBodyController.cannon)
  }

  setContext('physicsBody', physicsBodyStore)
</script>

<slot />
