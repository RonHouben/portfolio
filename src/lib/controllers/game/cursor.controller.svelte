<script lang="ts" context="module">
  import type { Vector3 } from '$lib/controllers/threejs/base.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { Mesh } from 'three'

  @Singleton
  export class CursorController {
    private name: string
    private cursorMesh: Mesh

    constructor(name: string) {
      this.name = name

      this.cursorMesh = this.getCursorMesh()
    }

    private getCursorMesh(): Mesh {
      const scene = get(sceneStore)
      const mesh = scene.getObjectByName(this.name) as Mesh

      if (!mesh) {
        throw new Error(`Unable to find cursor mesh with name: "${this.name}"`)
      }

      return mesh
    }

    public move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        anime({
          targets: this.cursorMesh.position,
          x,
          y,
          z,
          easing: 'steps(1)',
          complete: () => resolve()
        })
      })
    }

    public show(): void {
      this.cursorMesh.visible = true
      this.cursorMesh.material.opacity = 1
    }

    public hide(): void {
      this.cursorMesh.visible = true
      this.cursorMesh.material.transparent = true
      this.cursorMesh.material.opacity = 0
    }
  }
</script>
