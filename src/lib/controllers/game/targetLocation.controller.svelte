<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
  import { singleton } from '$lib/utils/Singleton.svelte'
  import { StateMachine } from '$lib/utils/StateMachine.svelte';
  import anime from 'animejs'
  import { Vec3 } from 'cannon-es'
  import { get } from 'svelte/store'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'
  import type { PhysicsWorld } from '../cannon-es/world.controller.svelte'
  import type { Mesh } from '../threejs/objects/mesh.controller.svelte'

  interface StateEventsMapping {
    hidden: 'fade-in' | 'teleport'
    visible: 'fade-out' | 'teleport' 
  }
  type Events = 'teleport' | 'fade-in' | 'fade-out'

  @singleton
  export class TargetLocationController {
    public readonly stateMachine: StateMachine<StateEventsMapping, Events>
    private mesh: Mesh
    private physicsWorld: PhysicsWorld
    private physicsBody: PhysicsBody
    private animation: {
      fadeIn?: anime.AnimeInstance
      fadeOut?: anime.AnimeInstance
    } = {}

    constructor(name: string) {
      this.stateMachine = new StateMachine({
        id: 'playerTargetLocationMachine',
        initial: 'hidden',
        states: {
          hidden: {
            teleport: {
              target: 'hidden',
              action: (data) => this.teleport(data)
            },
            'fade-in': {
              target: 'visible',
              action: (data) => this.fadeIn()
            }
          },
          visible: {
            teleport: {
              target: 'visible',
              action: (data) => this.teleport(data)
            },
            "fade-out": {
              target: 'hidden',
              action: (data) => this.fadeOut()
            }
          }
        }
      })

      this.mesh = this.getMesh(name)
      this.physicsWorld = this.getPhysicsWorld()
      this.physicsBody = this.getPhysicsBody(name)
    }

    private getMesh(name: string): Mesh {
      const scene = get(sceneStore)
      const mesh = scene.getObjectByName(name) as Mesh

      if (!mesh) {
        throw new Error(`Unable to find targetLocation mesh with name: "${name}"`)
      }

      return mesh
    }

    private getPhysicsWorld(): PhysicsWorld {
      return get(physicsWorldStore)
    }

    private getPhysicsBody(name: string): PhysicsBody {
      const physicsBody = (this.physicsWorld.bodies as PhysicsBody[]).find(
        (body) => body.name === name
      )

      if (!physicsBody) {
        throw new Error(`Unabled to find targetLocation physicsBody with name: "${name}"`)
      }

      return physicsBody
    }

    private teleport({ x, y, z }: Vector3): void {
      const target = new Vec3(x, y, z)
      target.y = this.physicsBody.position.y
      this.physicsBody.position.copy(target)
    }

    private async fadeIn(): Promise<void> {
      return new Promise((resolve) => {
        if (this.animation.fadeIn) {
          this.animation.fadeIn.restart()
        } else {
          this.mesh.material.opacity = 0

          this.animation.fadeIn = anime({
            targets: this.mesh.material,
            opacity: 1,
            begin: () => {
              this.animation.fadeOut?.pause()
              this.mesh.material.transparent = true
              this.mesh.material.visible = true
            },
            complete: () => {
              resolve()
            },
            easing: 'linear'
          })
        }
      })
    }

    private async fadeOut(): Promise<void> {
      return new Promise((resolve) => {
        const originalMaterial = this.mesh.material.clone()

        // this.animation.fadeIn?.pause()

        if (this.animation.fadeOut) {
          this.animation.fadeOut?.restart()
        } else {
          this.animation.fadeOut = anime({
            targets: this.mesh.material,
            opacity: 0,
            begin: () => {
              this.mesh.material.transparent = true
            },
            complete: () => {
              this.mesh.material.visible = false
              this.mesh.material.transparent = originalMaterial.transparent

              resolve()
            },
            easing: 'linear'
          })
        }
      })
    }

    public async send<T>(event: Events, data?: T): Promise<void> {
      this.stateMachine.send(event, data)
    }

    public get state(): keyof StateEventsMapping {
      return this.stateMachine.current
    }
  }
</script>
