import type { RendererControllerOptions } from './renderer.controller'
import { RendererType } from './renderer.controller'
import { RendererController } from './renderer.controller'

export type WebGLRendererControllerOptions = RendererControllerOptions

export class WebGLRendererController extends RendererController {
  constructor(options: WebGLRendererControllerOptions) {
    super(options, RendererType.webGL)
  }
}
