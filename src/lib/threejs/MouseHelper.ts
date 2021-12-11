import { cameraStore } from '../../stores/threejs/cameras/perspective.camera.store'
import { get } from 'svelte/store'
import { Object3D, Vector3 } from 'three'
import type { AnimeParams } from 'animejs'
import anime from 'animejs'
import { rendererStore } from '../../stores/threejs/renderer.store'
import { Body } from 'cannon-es'
import { Vec3 } from 'cannon-es'

export class MouseHelper {
  private clientX!: number
  private clientY!: number

  constructor() {
    addEventListener('mousemove', ({ clientX, clientY }) => {
      this.clientX = clientX
      this.clientY = clientY
    })
  }
  public getMousePositionInCanvas(): { x: number; y: number } {
    const canvas = get(rendererStore).domElement
    const canvasRect = canvas.getBoundingClientRect()

    return {
      x: (this.clientX / canvasRect.width) * 2 - 1,
      y: -(this.clientY / canvasRect.height) * 2 + 1
    }
  }

  public static followMouse(
    mouseX: number,
    mouseY: number,
    target: Object3D | Body,
    animeOptions?: Omit<AnimeParams, 'targets'>
  ): void {
    const camera = get(cameraStore)
    // Make the sphere follow the mouse
    const vector = new Vector3(mouseX, mouseY, target.position.z)

    vector.unproject(camera)

    const direction = vector.sub(camera.position).normalize()
    const distance = -camera.position.z / direction.z
    const newPosition = camera.position.clone().add(direction.multiplyScalar(distance))

    if (target instanceof Body) {
      target.position.set(newPosition.x, newPosition.y, newPosition.z)
    }

    if (target instanceof Object3D) {
      if (!animeOptions) {
        target.position.copy(newPosition as Vector3 & Vec3)
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
