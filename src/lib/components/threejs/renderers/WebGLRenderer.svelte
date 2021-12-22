<script lang="ts">
  import type { WebGLRendererControllerOptions } from '$lib/controllers/threejs/renderers/webGL.renderer.controller.svelte'
  import { WebGLRendererController } from '$lib/controllers/threejs/renderers/webGL.renderer.controller.svelte'
  import { onMount } from 'svelte'

  export let options: Omit<WebGLRendererControllerOptions, 'domElementId'>

  const domElementId = 'threejs'

  onMount(() => {
    new WebGLRendererController({ ...options, domElementId })
  })
</script>

<div id={domElementId}>
  <slot name="scenes">
    <!-- TODO: Create errorMessage component -->
    <p>
      Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
      `svelte:fragment` with `slot="scenes"` component?
    </p>
  </slot>
</div>

<style>
  div {
    display: flex;
    height: 100%;
    width: 100%;
    align-items: center;
    position: relative;
  }
</style>
