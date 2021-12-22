<script lang="ts">
  import {
    GroupAnimateFunction,
    GroupController,
    GroupControllerOptions
  } from '$lib/controllers/threejs/objects/group.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'

  export let options: GroupControllerOptions
  export let animate: GroupAnimateFunction | undefined = undefined

  let groupController: GroupController

  $: if ($sceneStore && !groupController) {
    groupController = new GroupController(options)
  }

  $: if (animate && groupController) {
    groupController.animate(animate)
  }

  $: if (groupController && options) {
    groupController.update(options)
  }
</script>

{#if groupController}
  <slot />
{/if}
