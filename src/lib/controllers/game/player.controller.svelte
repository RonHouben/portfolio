<script lang="ts" context="module">
  import type { Mesh } from '$lib/controllers/threejs/objects/mesh.controller.svelte'
  import type { PhysicsBody } from '$lib/controllers/cannon-es/body.controller.svelte'
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import { get } from 'svelte/store'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import anime from 'animejs'
  import type { Vector3 } from '$lib/controllers/threejs/base.controller.svelte'

  @Singleton
  export class PlayerController {
    private name: string
    private physicsBody: PhysicsBody
    private playerMesh: Mesh

    constructor(name: string) {
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

    public async move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        // TODO: find a way to get the height when a BufferGeometry is used
        // @ts-ignore
        const playerHeight = this.playerMesh.geometry.parameters.height

        anime({
          targets: this.physicsBody.position,
          x,
          y: y ? y + playerHeight / 2 : undefined,
          z,
          easing: 'linear',
          complete: () => resolve()
        })
      })
    }

    public lookAt({ x, y, z }: Vector3): void {
      this.physicsBody.quaternion.x = x || 0
      this.physicsBody.quaternion.y = y || 0
      this.physicsBody.quaternion.z = z || 0
    }
  }
</script>
