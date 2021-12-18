<script lang="ts">
  import { browser } from '$app/env'
  import {
    GroupAnimateFunction,
    GroupController,
    GroupControllerOptions
  } from '$lib/controllers/threejs/objects/group.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { onMount } from 'svelte'

  export let options: GroupControllerOptions
  export let animate: GroupAnimateFunction | undefined = undefined

  let groupController: GroupController

  onMount(() => {
    if ($sceneStore && browser) {
      groupController = new GroupController(options)
    }
  })

  $: if (animate && groupController) {
    groupController.animate(animate)
  }

  $: if (groupController) {
    groupController.update(options)
  }
</script>

{#if groupController}
  <slot />
{/if}
