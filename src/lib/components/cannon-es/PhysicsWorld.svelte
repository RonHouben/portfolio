<script lang="ts">
  import { PhysicsDebugController } from '$lib/controllers/cannon-es/helpers/debug.controller.svelte'
  import {
    PhysicsWorldController,
    PhysicsWorldControllerOptions
  } from '$lib/controllers/cannon-es/world.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: Omit<PhysicsWorldControllerOptions, 'createContactMaterials'> & {
    helpers?: { enabled: boolean }
  }
  export let createContactMaterials: PhysicsWorldControllerOptions['createContactMaterials'] =
    undefined
  export let createConstraints: PhysicsWorldControllerOptions['createConstraints'] = undefined

  let physicsWorldController: PhysicsWorldController
  let cannonDebugController: PhysicsDebugController

  $: if ($sceneStore && !physicsWorldController) {
    physicsWorldController = new PhysicsWorldController({
      ...options,
      createContactMaterials,
      createConstraints
    })
  }

  $: if (
    options.helpers?.enabled &&
    $sceneStore &&
    physicsWorldController &&
    !cannonDebugController
  ) {
    cannonDebugController = new PhysicsDebugController($sceneStore, physicsWorldController.cannon, {
      color: 'green'
    })

    cannonDebugController.renderLoop()
  }
</script>
