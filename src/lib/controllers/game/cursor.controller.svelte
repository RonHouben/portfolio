<script lang="ts" context="module">
import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte';
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
import { Vec3 } from 'cannon-es';
  import { get } from 'svelte/store'
import { Vector3 as ThreeVector3 } from 'three';
import type { PhysicsBody } from '../cannon-es/body.controller.svelte';
import type { PhysicsWorld } from '../cannon-es/world.controller.svelte';
  import type { Mesh } from '../threejs/objects/mesh.controller.svelte'

  type State = 'idle' | 'moving' | 'hiding'
  type Event = 'move' | 'hide' | 'show'

  export class CursorController {
    private name: string
    private cursorMesh: Mesh
    private physicsWorld: PhysicsWorld
    private physicsBody: PhysicsBody
    private state: State
    private animate: {
      moving?: anime.AnimeInstance
    } = {
      moving: undefined
    }

    constructor(name: string) {
      this.name = name
      this.state = 'hiding'

      this.cursorMesh = this.getCursorMesh(name)
      this.physicsWorld = this.getPhysicsWorld()
      this.physicsBody = this.getPhysicsBody(name)
    }

    private getCursorMesh(name: string): Mesh {
      const scene = get(sceneStore)
      const cursorMesh = scene.getObjectByName(name) as Mesh

      if (!cursorMesh) {
        throw new Error(`Unable to find cursor mesh with name: "${name}"`)
      }

      return cursorMesh
    }

     private getPhysicsWorld(): PhysicsWorld {
       return get(physicsWorldStore)
     }

     private getPhysicsBody(name: string): PhysicsBody {
       const physicsBody = (this.physicsWorld.bodies as PhysicsBody[]).find((body) => body.name === name)

       if (!physicsBody) {
         throw new Error(`Unabled to find cursor physicsBody with name: "${name}"`)
       }

       return physicsBody
     }

    private move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        // const target = new ThreeVector3(x, y, z)
        const target = new Vec3(x, y, z)
        // this.cursorMesh.position.copy(target)
        this.physicsBody.position.copy(target)

        resolve()
      })
    }

    private show(): void {
      this.cursorMesh.material.visible = true

      this.state = 'idle'
    }

    private hide(): void {
      this.cursorMesh.material.visible = false

      this.state = 'hiding'
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canHide = this.state === 'idle' || this.state === 'moving'
      const canMove = this.state === 'idle' || this.state === 'hiding'
      const canShow = this.state === 'hiding'

      if (event === 'show' && canShow) {
        this.show()
        return
      }

      if (event === 'hide' && canHide) {
        this.hide()
        return
      }

      if (event === 'move' && canMove && data) {
        await this.move(data)
        return
      }
    }
  }
</script>
