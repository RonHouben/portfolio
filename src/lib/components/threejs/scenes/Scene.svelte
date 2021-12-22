<script lang="ts">
  import {
    SceneController,
    SceneControllerOptions
  } from '$lib/controllers/threejs/objects/scene.controller.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'

  export let options: Omit<SceneControllerOptions, 'scene'>

  let sceneController: SceneController

  $: if ($rendererStore && !sceneController) {
    sceneController = new SceneController($rendererStore, options)
  }

  $: if ($rendererStore && sceneController) {
    sceneController.update(options)
  }
</script>

<slot name="physics" />
<slot name="meshes" />
<slot name="lights" />
<slot name="cameras">
  <!-- TODO: Create errorMessage component -->
  <p>
    Make sure to add a Camera component as a child! Did you forget to add the camera(s) in a
    `svelte:fragment` with `slot="cameras"` component?
  </p>
</slot>
<slot name="controls" />
<slot name="raycaster" />
<slot name="points" />
<slot name="loading-manager" />
