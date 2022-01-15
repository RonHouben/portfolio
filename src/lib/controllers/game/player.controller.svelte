<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
  import { singleton } from '$lib/utils/Singleton.svelte'
  import { StateMachine } from '$lib/utils/StateMachine.svelte'
  import anime from 'animejs'
  import * as CANNON from 'cannon-es'
  import { get } from 'svelte/store'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'
  import type { PhysicsWorld } from '../cannon-es/world.controller.svelte'

  type Events = 'move' | 'stop-moving'

  interface StateEventMapping {
    idle: 'move'
    moving: 'stop-moving'
  }

  interface Animations {
    move?: anime.AnimeInstance
    rotateToTarget?: anime.AnimeInstance
  }

  @singleton
  export class PlayerController {
    public readonly stateMachine: StateMachine<StateEventMapping, Events>
    private physicsWorld: PhysicsWorld
    private physicsBody: PhysicsBody
    private animation: Animations = {}

    constructor() {
      this.stateMachine = new StateMachine({
        id: 'playerMachine',
        initial: 'idle',
        states: {
          idle: {
            move: {
              target: 'moving',
              action: (data) => this.move(data)
            }
          },
          moving: {
            'stop-moving': {
              target: 'idle',
              action: (data) => this.stopMoving()
            }
          }
        }
      })
      this.physicsWorld = this.getPhysicsWorld()
      this.physicsBody = this.getPhysicsBody('player-physics')
    }

    private getPhysicsWorld(): PhysicsWorld {
      return get(physicsWorldStore)
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

        resolve()
      })
    }

    public async send<T>(event: Events, data?: T): Promise<void> {
      this.stateMachine.send(event, data)
    }
  }
</script>
