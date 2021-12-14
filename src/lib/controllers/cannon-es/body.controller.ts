import * as CANNON from 'cannon-es'
import { getContext, setContext } from 'svelte'

export type BodyControllerOptions = CANNON.BodyOptions & {
  rotation?: {
    x?: number
    y?: number
    z?: number
  }
  materialName?: string
}

export class BodyController {
  public cannon: CANNON.Body
  private world: CANNON.World

  constructor(options: BodyControllerOptions) {
    const { materialName, rotation, ...cannonBodyOptions } = options
    this.cannon = new CANNON.Body(cannonBodyOptions)
    this.world = getContext<CANNON.World>('world')

    this.setRotation(rotation)
    this.setMaterial(materialName)

    this.world.addBody(this.cannon)

    setContext<CANNON.Body>('body', this.cannon)
  }

  private setMaterial(name: BodyControllerOptions['materialName']): void {
    if (name) {
      const material = this.world.materials.find((m) => m.name === name)

      if (!material) {
        throw new Error(
          `Couldn't find material with name: "${name}". Are you sure it added to PhysicsWorld.options.materials?`
        )
      } else {
        // console.log(material)
        this.cannon.material = material
      }
    }
  }

  private setRotation(options: BodyControllerOptions['rotation']): void {
    if (options) {
      const { x, y, z } = options

      this.cannon.quaternion.setFromEuler(x || 0, y || 0, z || 0)
    }
  }
}
