<script lang="ts" context="module">
  import type { RendererControllerOptions } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'
  import {
    RendererController,
    RendererType
  } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'

  export type WebGLRendererControllerOptions = RendererControllerOptions

  export class WebGLRendererController extends RendererController {
    constructor(options: WebGLRendererControllerOptions) {
      super(options, RendererType.webGL)
    }
  }
</script>
