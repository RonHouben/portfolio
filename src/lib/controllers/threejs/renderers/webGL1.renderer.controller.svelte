<script lang="ts" context="module">
  import type { RendererControllerOptions } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'
  import {
    RendererController,
    RendererType
  } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'

  export type WebGL1RendererControllerOptions = RendererControllerOptions

  export class WebGL1RendererController extends RendererController {
    constructor(options: WebGL1RendererControllerOptions) {
      super(options, RendererType.webGL1)
    }
  }
</script>
