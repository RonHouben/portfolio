<script lang="ts" context="module">
  import type { BodyOptions, ContactEquation, World } from 'cannon-es'
  import { Body } from 'cannon-es'
  import { physicsBodyStore } from '$lib/stores/cannon-es/body.store.svelte'
  import type { Writable } from 'svelte/store'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
import type { PhysicsWorld } from './world.controller.svelte';

  interface TriggerEvent {
    type: 'collide'
    body: PhysicsBody | null
    contact: ContactEquation
    target: PhysicsBody | null
  }

  interface TriggerEndEvent {
    type: 'endContact'
    bodyA: PhysicsBody | null
    bodyB: PhysicsBody | null
    target: PhysicsWorld
  }

  export type PhysicsBodyControllerOptions = BodyOptions &
    {
      name: string
      materialName?: string
      position?: Vector3
      rotation?: Vector3
      appendMeshPosition?: boolean,
      onTrigger?: (event: TriggerEvent) => void
      onTriggerEnd?: (event: TriggerEndEvent) => void
    }

  export interface PhysicsBody extends Body {
    name: string
    appendMeshPosition: boolean
  }

  export type PhysicsBodyStore = Writable<PhysicsBody>

  export class PhysicsBodyController {
    public cannon: PhysicsBody
    private world: World

    constructor(world: World, options: PhysicsBodyControllerOptions) {
      const { 
        name,
        materialName,
        rotation,
        appendMeshPosition,
        position, 
        ...cannonBodyOptions
      } = options

      this.cannon = new Body(cannonBodyOptions) as PhysicsBody
      this.world = world

      this.init(options)

      world.addBody(this.cannon)

      physicsBodyStore.set(this.cannon)

      this.renderLoop()
    }

    private init(options: PhysicsBodyControllerOptions): void {
      this.cannon.name = options.name
      this.cannon.appendMeshPosition = options.appendMeshPosition || false

      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setMaterial(options.materialName)

      if (options.isTrigger) {
        this.setTriggerEventListener(options.onTrigger, options.onTriggerEnd)
      }
    }

    private renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      physicsBodyStore.update(() => this.cannon)
    }

    private setPosition(position: PhysicsBodyControllerOptions['position']): void {
      if (position) {
        this.cannon.position.set(position.x || 0, position.y || 0, position.z || 0)
      }
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

    private setTriggerEventListener(onTrigger: PhysicsBodyControllerOptions['onTrigger'], onTriggerEnd: PhysicsBodyControllerOptions['onTriggerEnd']): void {
      if (onTrigger) {
        this.cannon.addEventListener('collide', onTrigger)
      }

      if (onTriggerEnd) {
        this.world.addEventListener('endContact', onTriggerEnd)
      }
    }
  }
</script>
