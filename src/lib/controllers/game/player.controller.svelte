<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'
  import type { PhysicsWorld } from '../cannon-es/world.controller.svelte'
  import type { ThreeJSObject } from '../threejs/base.controller.svelte'
  import type { ThreeJSScene } from '../threejs/objects/scene.controller.svelte'
  import * as CANNON from 'cannon-es'
  import { singleton } from '$lib/utils/Singleton.svelte'

  type State = 'idle' | 'moving'
  type Event = 'move' | 'stop-moving'

  interface Animations {
    move?: anime.AnimeInstance
    rotateToTarget?: anime.AnimeInstance
  }

  @singleton
  export class PlayerController {
    public state: State
    private scene: ThreeJSScene
    private physicsWorld: PhysicsWorld
    private playerGroupMesh: ThreeJSObject
    private physicsBody: PhysicsBody
    private animation: Animations = {}

    constructor(name: string) {
      this.state = 'idle'
      this.scene = this.getScene()
      this.physicsWorld = this.getPhysicsWorld()
      this.playerGroupMesh = this.getPlayerGroupMesh(name)
      this.physicsBody = this.getPhysicsBody('player-physics')
    }

    private getScene(): ThreeJSScene {
      return get(sceneStore)
    }

    private getPhysicsWorld(): PhysicsWorld {
      return get(physicsWorldStore)
    }

    private getPlayerGroupMesh(name: string): ThreeJSObject {
      const group = this.scene.getObjectByName(name)

      if (!group) {
        throw new Error(`Unable to find player group mesh with name: "${name}"`)
      }

      return group
    }

    private getPhysicsBody(name: string): PhysicsBody {
      const physicsBody = (this.physicsWorld.bodies as PhysicsBody[]).find(
        (body) => body.name === name
      )

      if (!physicsBody) {
        throw new Error(`Unable to find physicsBody for player with name: "${name}"`)
      }

      return physicsBody
    }

    private async move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        this.state = 'moving'

        const speedScalar = 5
        // Compute direction to target
        const direction = new CANNON.Vec3()
        const physicsTarget = new CANNON.Body({
          position: new CANNON.Vec3(x, y, z)
        })

        physicsTarget.position.vsub(this.physicsBody.position, direction)
        direction.y = 0
        direction.normalize()
        direction.scale(speedScalar, direction)

        // Get the rotation between the forward vector and the direction vector
        const forward = new CANNON.Vec3(0, 0, 1)
        const targetQ = new CANNON.Quaternion().setFromVectors(forward, direction)

        const time = {
          left: 0
        }

        this.animation.move = anime({
          targets: time,
          left: 1,
          update: () => {
            this.physicsBody.quaternion.slerp(targetQ, time.left, this.physicsBody.quaternion)
            this.physicsBody.velocity.lerp(direction, time.left, this.physicsBody.velocity)
          },
          complete: () => {
            resolve()
          },
          easing: 'linear',
          duration: 1000
        })
      })
    }

    private stopMoving(): Promise<void> {
      return new Promise((resolve) => {
        this.animation.move?.pause()
        this.animation.move = undefined
        this.physicsBody.velocity.setZero()

        this.state = 'idle'

        resolve()
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canMove = (this.state === 'idle' || this.state === 'moving') && isVector3(data)
      const canCancelMove = this.state === 'moving' // || 'idle'

      if (event === 'move' && canMove) {
        await this.move(data)
        return
      }

      if (event === 'stop-moving' && canCancelMove) {
        await this.stopMoving()
        return
      }
    }
  }
</script>
