import type { RendererControllerOptions } from '$lib/controllers/threejs/renderers/renderer.controller'
import {
  RendererController,
  RendererType
} from '$lib/controllers/threejs/renderers/renderer.controller'

export type WebGLRendererControllerOptions = RendererControllerOptions

export class WebGLRendererController extends RendererController {
  constructor(options: WebGLRendererControllerOptions) {
    super(options, RendererType.webGL)
  }
}
