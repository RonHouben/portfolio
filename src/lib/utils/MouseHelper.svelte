<script lang="ts" context="module">
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'
  import type { AnimeParams } from 'animejs'
  import anime from 'animejs'
  import { Body } from 'cannon-es'
  import { get } from 'svelte/store'
  import { Object3D, Vector3 } from 'three'

  export interface MousePositionInCanvas {
    x: number
    y: number
    z: number
  }

  export class MouseHelper {
    private static instance: MouseHelper
    private clientX!: number
    private clientY!: number
    public x!: number
    public y!: number
    public z!: number

    constructor() {
      if (MouseHelper.instance) {
        return MouseHelper.instance
      }

      MouseHelper.instance = this

      this.addEventListeners()
    }

    private addEventListeners(): void {
      addEventListener('mousemove', this.updateMousePosition.bind(this))
      addEventListener('touchmove', this.updateMousePosition.bind(this))
    }

    private updateMousePosition(this: MouseHelper, event: MouseEvent | TouchEvent): void {
      if (event instanceof MouseEvent) {
        this.clientX = event.clientX
        this.clientY = event.clientY

        const { x, y, z } = this.getMousePositionInCanvas()

        this.x = x
        this.y = y
        this.z = z
      }

      if (event instanceof TouchEvent) {
        const { clientX, clientY } = event.touches[0]

        this.clientX = clientX
        this.clientY = clientY

        const { x, y, z } = this.getMousePositionInCanvas()

        this.x = x
        this.y = y
        this.z = z
      }
    }

    private getMousePositionInCanvas(): MousePositionInCanvas {
      const renderer = get(rendererStore)
      const canvas = renderer.domElement
      const canvasRect = canvas.getBoundingClientRect()

      return {
        x: (this.clientX / canvasRect.width) * 2 - 1,
        y: -(this.clientY / canvasRect.height) * 2 + 1,
        z: 0.5
      }
    }

    public followMouse(target: Object3D | Body, animeOptions?: Omit<AnimeParams, 'targets'>): void {
      const camera = get(cameraStore)
      // Make the sphere follow the mouse
      const vector = new Vector3(this.x, this.y, this.z)

      vector.unproject(camera)

      const direction = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / direction.z
      const newPosition = camera.position.clone().add(direction.multiplyScalar(distance))

      if (target instanceof Body) {
        target.position.set(newPosition.x, newPosition.y, newPosition.z)
      }

      if (target instanceof Object3D) {
        if (!animeOptions) {
          target.position.set(newPosition.x, newPosition.y, newPosition.z)
        } else {
          anime({
            ...animeOptions,
            x: newPosition.x,
            y: newPosition.y
          })
        }
      }
    }
  }
</script>
