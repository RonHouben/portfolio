<script lang="ts" context="module">
  import type { RendererControllerOptions } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'
  import { RendererController } from '$lib/controllers/threejs/renderers/renderer.controller.svelte'
  import { RendererType } from '$lib/utils/types'

  export type WebGLRendererControllerOptions = RendererControllerOptions

  export class WebGLRendererController extends RendererController {
    constructor(options: WebGLRendererControllerOptions) {
      super(options, RendererType.webGL)
    }
  }
</script>
