<script lang="ts" context="module">
  import type { Vector3 } from '$lib/controllers/threejs/base.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { Mesh } from 'three'

  type State = 'idle' | 'moving' | 'hiding'
  type Event = 'move' | 'hide' | 'show'

  @Singleton
  export class CursorController {
    private name: string
    private cursorMesh: Mesh
    private state: State

    constructor(name: string) {
      this.name = name
      this.state = 'hiding'

      this.cursorMesh = this.getCursorMesh()

      // this.send('hide')
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
      // this.cursorMesh.material.opacity = 1

      this.state ='idle'
    }

    private hide(): void {
      this.cursorMesh.material.visible = false
      // this.cursorMesh.material.transparent = true
      // this.cursorMesh.material.opacity = 0

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
