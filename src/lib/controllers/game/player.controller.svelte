<script lang="ts" context="module">
  import type { Mesh } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import { get } from 'svelte/store'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import anime from 'animejs'
  import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte'

  type State = 'idle' | 'moving' | 'rotating'
  type Event = 'move' | 'cancel-move' | 'rotate' | 'cancel-rotate'

  interface Animations {
    move?: anime.AnimeInstance
    rotate?: anime.AnimeInstance
  }

  export class PlayerController {
    private state: State
    private name: string
    private groupMesh: Mesh
    private playerMesh: Mesh
    private playerYCenter: number
    private animation: Animations = {
      move: undefined,
      rotate: undefined
    }

    constructor(name: string) {
      this.state = 'idle'
      this.name = name
      // this.physicsBody = this.getPhysicalBody()
      this.groupMesh = this.getGroupMesh()
      this.playerMesh = this.getPlayerMesh('player-body')

      const playerBodyHeight = this.playerMesh.geometry.parameters.height as number
      this.playerYCenter = playerBodyHeight / 2
    }

    // private getPhysicalBody(): PhysicsBody {
    //   const physicsWorld = get(physicsWorldStore)
    //   const physicsBody = (physicsWorld.bodies as PhysicsBody[]).find(
    //     (body) => body.name === this.name
    //   )

    //   if (!physicsBody) {
    //     throw new Error(`Unable to find player physicsBody with name: "${this.name}"`)
    //   }

    //   return physicsBody
    // }

    private getGroupMesh(): Mesh {
      const scene = get(sceneStore)
      const playerGroupMesh = scene.getObjectByName(this.name) as Mesh

      if (!playerGroupMesh) {
        throw new Error(`Unable to find player group mesh with name: "${this.name}"`)
      }

      return playerGroupMesh
    }

    private getPlayerMesh(playerMeshName: string): Mesh {
      const playerMesh = this.groupMesh.getObjectByName(playerMeshName) as Mesh

      if (!playerMesh) {
        throw new Error(`Unable to find player mesh with name: "${playerMeshName}"`)
      }

      return playerMesh
    }

    private async move({ x, y, z }: Vector3): Promise<void> {
      this.state = 'moving'

      return new Promise((resolve) => {
        this.animation.move = anime({
          targets: this.groupMesh.position,
          x,
          y: y ? y + this.playerYCenter : undefined,
          z,
          easing: 'linear',
          complete: () => {
            this.state = 'idle'
            resolve()
          }
        })
      })
    }

    private async rotate({ x, y, z }: Vector3): Promise<void> {
      this.state = 'rotating'
      
      const delta = {
        x: this.groupMesh.rotation.x,
        y: this.groupMesh.rotation.y,
        z: this.groupMesh.rotation.z
      }

      return new Promise((resolve) => {
        this.animation.rotate = anime({
          targets: delta,
          x,
          y,
          z,
          change: () => {
            this.groupMesh.lookAt(delta.x, delta.y ? delta.y + this.playerYCenter : undefined, delta.z)
            console.log('changing animation')
            // this.groupMesh.lookAt(delta.x, delta.y, delta.z)
          },
          complete: () => {
            // this.groupMesh.lookAt(delta.x, delta.y ? delta.y + this.playerYCenter : undefined, delta.z)
            // this.groupMesh.lookAt(delta.x, delta.y ? delta.y + this.playerYCenter : undefined, delta.z)
            // this.groupMesh.lookAt(originalX, originalY ? originalY + this.playerYCenter : undefined, originalZ)
            console.log('completed animation')
            this.state = 'idle'
            resolve()
          },
          easing: 'linear'
        })
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canRotate = (this.state === 'idle' || this.state === 'moving') && isVector3(data)
      const canMove = (this.state === 'idle' || this.state === 'rotating') && isVector3(data)
      const canCancelMove = this.state === 'moving' && this.animation.move
      const canCancelRotate = this.state === 'rotating' && this.animation.rotate

      if (event === 'rotate' && canRotate) {
        await this.rotate(data)
        return
      }

      if (event === 'move' && canMove) {
        await this.move(data)
        return
      }

      if (event === 'cancel-rotate' && canCancelRotate) {
        this.animation.rotate!.pause()
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
