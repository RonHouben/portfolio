<script lang="ts" context="module">
  import type { BodyOptions, World } from 'cannon-es'
  import { Body } from 'cannon-es'
  import { Interactable, InteractionOptions } from '$lib/controllers/interactable.controller.svelte'
  import { physicsBodyStore } from '$lib/stores/cannon-es/body.store.svelte'

  export type PhysicsBodyControllerOptions = BodyOptions & {
    name: string
    materialName?: string
    rotation?: {
      x?: number
      y?: number
      z?: number
    }
    interactions?: InteractionOptions<PhysicsBody>
  }

  export interface PhysicsBody extends Body {
    name: string
  }

  export class PhysicsBodyController extends Interactable<PhysicsBody> {
    public cannon: PhysicsBody
    private world: World

    constructor(world: World, options: PhysicsBodyControllerOptions) {
      const { name, materialName, rotation, interactions, ...cannonBodyOptions } = options
      super(interactions)
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
