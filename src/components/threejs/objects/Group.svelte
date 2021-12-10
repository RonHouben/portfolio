<script lang="ts">
  import { onMount } from 'svelte'
  import {
    GroupAnimateFunction,
    GroupController,
    GroupControllerOptions
  } from '../../../controllers/threejs/objects/group.controller'

  export let options: GroupControllerOptions
  export let animate: GroupAnimateFunction | undefined = undefined
  // export let onClick: GroupOnClickFunction | undefined = undefined

  let groupController: GroupController

  onMount(() => {
    groupController = new GroupController(options)
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
