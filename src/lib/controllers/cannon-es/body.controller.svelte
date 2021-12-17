<script lang="ts" context="module">
  import * as CANNON from 'cannon-es'
  import { getContext, setContext } from 'svelte'

  export type BodyControllerOptions = CANNON.BodyOptions & {
    name: string
    materialName?: string
    rotation?: {
      x?: number
      y?: number
      z?: number
    }
  }

  export interface PhysicsBody extends CANNON.Body {
    name: string
  }

  export class BodyController {
    public cannon: CANNON.Body & { name?: BodyControllerOptions['name'] }
    private world: CANNON.World

    constructor(options: BodyControllerOptions) {
      const { materialName, rotation, ...cannonBodyOptions } = options
      this.cannon = new CANNON.Body(cannonBodyOptions)
      this.world = getContext<CANNON.World>('world')

      this.cannon.name = options.name

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
</script>
