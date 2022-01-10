<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
  import { singleton } from '$lib/utils/Singleton.svelte'
  import anime from 'animejs'
  import { Vec3 } from 'cannon-es'
  import { get } from 'svelte/store'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'
  import type { PhysicsWorld } from '../cannon-es/world.controller.svelte'
  import type { Mesh } from '../threejs/objects/mesh.controller.svelte'

  type State = 'idle' | 'teleporting' | 'fading-in' | 'fading-out'
  type Event = 'teleport' | 'fade-in' | 'fade-out'

  @singleton
  export class TargetLocationController {
    private name: string
    private mesh: Mesh
    private physicsWorld: PhysicsWorld
    private physicsBody: PhysicsBody
    private state: State
    private animation: {
      fadeIn?: anime.AnimeInstance
      fadeOut?: anime.AnimeInstance
    } = {}

    constructor(name: string) {
      this.name = name
      this.state = 'idle'

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
      this.state = 'teleporting'

      const target = new Vec3(x, y, z)
      target.y = this.physicsBody.position.y
      this.physicsBody.position.copy(target)

      this.state = 'idle'
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
              this.state = 'fading-in'
              this.animation.fadeOut?.pause()
              this.mesh.material.transparent = true
              this.mesh.material.visible = true
            },
            complete: () => {
              this.state = 'idle'

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
              this.state = 'fading-in'
              this.mesh.material.transparent = true
            },
            complete: () => {
              this.mesh.material.visible = false
              this.mesh.material.transparent = originalMaterial.transparent

              this.state = 'idle'

              resolve()
            },
            easing: 'linear'
          })
        }
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canTeleport = this.state !== 'teleporting'
      const canFadeIn = this.state === 'idle' // || this.state === 'fading-out'
      const canFadeOut = this.state === 'idle' // || this.state === 'fading-in'

      if (event === 'fade-in' && canFadeIn) {
        await this.fadeIn()
        return
      }

      if (event === 'fade-out' && canFadeOut) {
        await this.fadeOut()
        return
      }

      if (event === 'teleport' && canTeleport && data) {
        this.teleport(data)
        return
      }
    }
  }
</script>
