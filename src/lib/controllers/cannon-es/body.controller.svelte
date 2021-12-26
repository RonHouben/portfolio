<script lang="ts" context="module">
  import type { BodyOptions, World } from 'cannon-es'
  import { Body } from 'cannon-es'
  import { physicsBodyStore } from '$lib/stores/cannon-es/body.store.svelte'
  import type { Writable } from 'svelte/store'

  export type PhysicsBodyControllerOptions = BodyOptions & {
    name: string
    materialName?: string
    rotation?: {
      x?: number
      y?: number
      z?: number
    }
  }

  export interface PhysicsBody extends Body {
    name: string
  }

  export type PhysicsBodyStore = Writable<PhysicsBody>

  export class PhysicsBodyController {
    public cannon: PhysicsBody
    private world: World

    constructor(world: World, options: PhysicsBodyControllerOptions) {
      const { name, materialName, rotation, ...cannonBodyOptions } = options
      this.cannon = new Body(cannonBodyOptions) as PhysicsBody
      this.cannon.name = name

      this.world = world

      this.setRotation(rotation)
      this.setMaterial(materialName)

      world.addBody(this.cannon)

      physicsBodyStore.set(this.cannon)

      this.renderLoop()
    }

    private renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      physicsBodyStore.update(() => this.cannon)
    }

    private setMaterial(name: PhysicsBodyControllerOptions['materialName']): void {
      if (name && this.world) {
        const material = this.world.materials.find((m) => m.name === name)

        if (!material) {
          throw new Error(
            `Couldn't find material with name: "${name}". Are you sure it added to PhysicsWorld.options.materials?`
          )
        } else {
          this.cannon.material = material
        }
      }
    }

    private setRotation(options: PhysicsBodyControllerOptions['rotation']): void {
      if (options) {
        const { x, y, z } = options

        this.cannon.quaternion.setFromEuler(x || 0, y || 0, z || 0)
      }
    }
  }
</script>
