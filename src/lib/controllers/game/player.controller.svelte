<script lang="ts" context="module">
  import type { Mesh } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import type { PhysicsBody } from '$lib/controllers/cannon-es/body.controller.svelte'
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { get } from 'svelte/store'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import anime from 'animejs'
  import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte'

  type State = 'idle' | 'moving'
  type Event = 'move' | 'cancel-move'

  interface Animations {
    move?: anime.AnimeInstance
    rotate?: anime.AnimeInstance
  }

  export class PlayerController {
    private state: State
    private name: string
    private physicsBody: PhysicsBody
    private playerMesh: Mesh
    private animation: Animations = {
      move: undefined,
      rotate: undefined
    }

    constructor(name: string) {
      this.state = 'idle'
      this.name = name
      this.physicsBody = this.getPhysicalBody()
      this.playerMesh = this.getPlayerMesh()
    }

    private getPhysicalBody(): PhysicsBody {
      const physicsWorld = get(physicsWorldStore)
      const physicsBody = (physicsWorld.bodies as PhysicsBody[]).find(
        (body) => body.name === this.name
      )

      if (!physicsBody) {
        throw new Error(`Unable to find player physicsBody with name: "${this.name}"`)
      }

      return physicsBody
    }

    private getPlayerMesh(): Mesh {
      const scene = get(sceneStore)
      const playerMesh = scene.getObjectByName(this.name) as Mesh

      if (!playerMesh) {
        throw new Error(`Unable to find player mesh with name: "${this.name}"`)
      }

      return playerMesh
    }

    private async move(position: Vector3): Promise<void> {
      this.state = 'moving'

      return new Promise((resolve) => {
        // TODO: find a way to get the height when a BufferGeometry is used
        // @ts-ignore
        const playerHeight = this.playerMesh.geometry.parameters.height

        this.animation.move = anime({
          targets: this.physicsBody.position,
          x: position.x,
          y: position.y ? position.y + playerHeight / 2 : undefined,
          z: position.z,
          easing: 'linear',
          complete: () => {
            this.state = 'idle'

            resolve()
          }
        })

        // TODO: find a way to rotate the place based on the mouse position (Raycaster)
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canMove = this.state === 'idle' && isVector3(data)
      const canCancelMove = this.state === 'moving' && this.animation.move

      if (event === 'move' && canMove) {
        await this.move(data)
      }

      if (event === 'cancel-move' && canCancelMove) {
          this.animation.move!.pause()
          this.state = 'idle'
          return
      }
    }
  }
</script>
