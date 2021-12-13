import type { RendererControllerOptions } from '$lib/controllers/threejs/renderers/renderer.controller'
import {
  RendererController,
  RendererType
} from '$lib/controllers/threejs/renderers/renderer.controller'

export type WebGL1RendererControllerOptions = RendererControllerOptions

export class WebGL1RendererController extends RendererController {
  constructor(options: WebGL1RendererControllerOptions) {
    super(options, RendererType.webGL1)
  }
}
