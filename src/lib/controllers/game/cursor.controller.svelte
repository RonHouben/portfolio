<script lang="ts" context="module">
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte';
  import { get } from 'svelte/store'
  import type { Mesh } from '../threejs/objects/mesh.controller.svelte';

  type State = 'idle' | 'moving' | 'hiding'
  type Event = 'move' | 'hide' | 'show'

  export class CursorController {
    private name: string
    private cursorMesh: Mesh
    private state: State

    constructor(name: string) {
      this.name = name
      this.state = 'hiding'

      this.cursorMesh = this.getCursorMesh()
    }

    private getCursorMesh(): Mesh {
      const scene = get(sceneStore)
      const cursorMesh = scene.getObjectByName(this.name) as Mesh

      if (!cursorMesh) {
        throw new Error(`Unable to find cursor mesh with name: "${this.name}"`)
      }

      return cursorMesh
    }

    private move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        this.state = 'moving'
        this.cursorMesh.position.x = x || this.cursorMesh.position.x
        this.cursorMesh.position.y = y || this.cursorMesh.position.y
        this.cursorMesh.position.z = z || this.cursorMesh.position.z
        this.state = 'idle'

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
        this.move(data)
        return
      }
    }
  }
</script>
