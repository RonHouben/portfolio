import type { BodyOptions, World } from 'cannon-es'
import { Body } from 'cannon-es'
import { setContext } from 'svelte'

export type BodyControllerOptions = BodyOptions & {
  rotation?: {
    x?: number
    y?: number
    z?: number
  }
}

export class BodyController {
  public cannon: Body
  private world: World

  constructor(world: World, options: BodyControllerOptions) {
    this.cannon = new Body(options)
    this.world = world

    this.setRotation(options.rotation)

    this.world.addBody(this.cannon)

    setContext<Body>('body', this.cannon)
  }

  private setRotation(options: BodyControllerOptions['rotation']): void {
    if (options) {
      const { x, y, z } = options

      this.cannon.quaternion.setFromEuler(x || 0, y || 0, z || 0)
    }
  }
}
