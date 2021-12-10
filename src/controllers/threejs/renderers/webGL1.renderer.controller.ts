import type { RendererControllerOptions } from './renderer.controller'
import { RendererType } from './renderer.controller'
import { RendererController } from './renderer.controller'

export type WebGL1RendererControllerOptions = RendererControllerOptions

export class WebGL1RendererController extends RendererController {
  constructor(options: WebGL1RendererControllerOptions) {
    super(options, RendererType.webGL1)
  }
}
