<script lang="ts">
  import {
    PhysicsBodyController,
    PhysicsBodyControllerOptions
  } from '$lib/controllers/cannon-es/body.controller.svelte'
  import { worldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: PhysicsBodyControllerOptions

  let physicsBodyController: PhysicsBodyController

  $: if ($worldStore && $sceneStore && !physicsBodyController) {
    physicsBodyController = new PhysicsBodyController($worldStore, options)
  }
</script>

<slot />
