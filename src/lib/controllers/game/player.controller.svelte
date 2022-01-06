<script lang="ts" context="module">
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import * as THREE from 'three'
  import type { PhysicsBody } from '../cannon-es/body.controller.svelte'
  import type { PhysicsWorld } from '../cannon-es/world.controller.svelte'
  import type { ThreeJSObject } from '../threejs/base.controller.svelte'
  import type { ThreeJSScene } from '../threejs/objects/scene.controller.svelte'
  import * as CANNON from 'cannon-es'

  type State = 'idle' | 'moving' | 'rotating-to-target'
  type Event = 'move' | 'cancel-move' | 'rotate-to-target' | 'cancel-rotate-to-target'

  interface Animations {
    move?: anime.AnimeInstance
    rotateToTarget?: anime.AnimeInstance
  }

  export class PlayerController {
    private state: State
    private scene: ThreeJSScene
    private physicsWorld: PhysicsWorld
    private playerGroupMesh: ThreeJSObject
    private physicsBody: PhysicsBody
    private animation: Animations = {
      move: undefined,
      rotateToTarget: undefined
    }

    constructor(name: string) {
      this.state = 'idle'
      this.scene = this.getScene()
      this.physicsWorld = this.getPhysicsWorld()
      this.playerGroupMesh = this.getPlayerGroupMesh(name)
      this.physicsBody = this.getPhysicsBody('physics')
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

    private async rotateToTarget({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        const target = new THREE.Vector3(x, y, z)
        const tempMesh = this.playerGroupMesh.clone()
        const q1 = tempMesh.quaternion.clone()
        tempMesh.lookAt(target)
        const q2 = tempMesh.quaternion.clone()

        // PHYSICSBODY
        // Compute direction to target
        const direction = new CANNON.Vec3()
        const physicsTarget = new CANNON.Body({
          position: new CANNON.Vec3(x, y, z)
        })

        physicsTarget.position.vsub(this.physicsBody.position, direction)
        // direction.y = 0
        direction.normalize()

        // Get the rotation between the forward vector and the direction vector
        const forward = new CANNON.Vec3(0, 0, 1)

        const targetQ = new CANNON.Quaternion().setFromVectors(forward, direction)

        const time = {
          left: 0
        }

        this.animation.rotateToTarget = anime({
          targets: time,
          left: 1,
          begin: () => {
            this.state = 'rotating-to-target'
          },
          update: () => {
            this.playerGroupMesh.quaternion.slerpQuaternions(q1, q2, time.left)
            // this.physicsBody.quaternion.setFromVectors(forward, direction)
            this.physicsBody.quaternion.slerp(targetQ, time.left, this.physicsBody.quaternion)
          },
          complete: () => {
            this.state = 'idle'
            resolve()
          },
          easing: 'linear',
          duration: 1000
        })
      })
    }

    private async move({ x, y, z }: Vector3): Promise<void> {
      const target = new CANNON.Vec3(x, y, z)
      // const targetBody = new CANNON.Body({ isTrigger: true, position: new CANNON.Vec3(x, y, z) })
      // const targetShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.25, 0.5))
      // targetBody.addShape(targetShape)

      // this.physicsWorld.addBody(targetBody)
      // this.physicsBody.velocity.setZero()

      return new Promise((resolve) => {
        this.animation.move = anime({
          targets: [this.playerGroupMesh.position, this.physicsBody.position],
          x,
          y,
          z,
          begin: () => {
            this.state = 'moving'
            // this.physicsBody.velocity.copy(target)
            // this.physicsBody.applyImpulse(impulse, topPoint)
            // this.physicsBody.linearDamping = 0.3
            // this.physicsBody.angularDamping = 0.3
          },
          update: () => {
            // const difference = target.vsub(this.physicsBody.position)
            // console.log(difference)
            // if (targetBody.collisionResponse) {
            // this.physicsBody.velocity.setZero()
            // console.log('PINGG')
            // }
          },
          complete: () => {
            this.state = 'idle'
            resolve()
          },
          easing: 'linear'
        })
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canRotateToTarget =
        (this.state === 'idle' || this.state === 'moving') && isVector3(data)
      const canMove =
        (this.state === 'idle' || this.state === 'rotating-to-target') && isVector3(data)
      const canCancelMove = this.state === 'moving' && this.animation.move
      const canCancelRotateToTarget =
        this.state === 'rotating-to-target' && this.animation.rotateToTarget

      if (event === 'rotate-to-target' && canRotateToTarget) {
        if (this.animation.rotateToTarget) {
        }
        await this.rotateToTarget(data)
        return
      }

      if (event === 'move' && canMove) {
        await this.move(data)
        return
      }

      if (event === 'cancel-rotate-to-target' && canCancelRotateToTarget) {
        this.animation.rotateToTarget!.pause()
        this.state = 'idle'
        return
      }

      if (event === 'cancel-move' && canCancelMove) {
        this.animation.move!.pause()
        this.state = 'idle'
        return
      }
    }
  }
</script>
