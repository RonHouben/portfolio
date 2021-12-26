<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { Constraint, ContactMaterial, Material, World, WorldOptions } from 'cannon-es'
  import type { PhysicsBody } from './body.controller.svelte'

  export type PhysicsWorldControllerOptions = WorldOptions & {
    materials?: Material[]
    createContactMaterials?: (materials: Material[]) => ContactMaterial[]
    createConstraints?: (bodies: PhysicsBody[]) => Constraint[]
  }
  export type PhysicsWorld = World

  export class PhysicsWorldController {
    public cannon: World
    private lastCallTime?: number
    private timeStep: number = 1 / 60 // seconds

    constructor(options: PhysicsWorldControllerOptions) {
      this.cannon = new World(options)

      this.setMaterials(options.materials)
      this.createContactMaterials(options.createContactMaterials)
      this.createConstraints(options.createConstraints)

      physicsWorldStore.set(this.cannon)

      this.renderLoop()
    }

    private createConstraints(func: PhysicsWorldControllerOptions['createConstraints']): void {
      setTimeout(() => {
        if (func) {
          const constraints = func(this.cannon.bodies as PhysicsBody[])

          if (constraints) {
            for (const constraint of constraints) {
              this.cannon.addConstraint(constraint)
            }
          }
        }
      })
    }

    private setMaterials(materials: PhysicsWorldControllerOptions['materials']): void {
      if (materials) {
        for (const material of materials) {
          this.cannon.addMaterial(material)
        }
      }
    }

    private createContactMaterials(
      func: PhysicsWorldControllerOptions['createContactMaterials']
    ): void {
      if (func) {
        const contactMaterials = func(this.cannon.materials)

        if (contactMaterials) {
          for (const contactMaterial of contactMaterials) {
            this.cannon.addContactMaterial(contactMaterial)
          }
        }
      }
    }

    private renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      const time = performance.now() / 1000 // seconds

      if (!this.lastCallTime) {
        this.cannon.step(this.timeStep)
      } else {
        const dt = time - this.lastCallTime

        this.cannon.step(this.timeStep, dt)
      }
      this.lastCallTime = time
    }
  }
</script>
