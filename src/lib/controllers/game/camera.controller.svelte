<script lang="ts" context="module">
  import { perspectiveCameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { PerspectiveCamera } from 'three'
  import { Vector3 as ThreeVector3 } from 'three'

  type State = 'idle' | 'moving'
  type Event = 'move'

  export class CameraController {
    private state: State
    private camera: PerspectiveCamera
    private originalPosition: { x: number; y: number; z: number }

    constructor() {
      this.state = 'idle'

      this.camera = this.getCamera()

      const { x, y, z } = this.camera.position
      this.originalPosition = { x, y, z }
    }

    private getCamera(): PerspectiveCamera {
      return get(perspectiveCameraStore)
    }

    private async move({ x, y, z }: Vector3): Promise<void> {
      const target = new ThreeVector3(x, y, z)

      return new Promise((resolve) => {
        anime({
          targets: this.camera.position,
          x: target.x + this.originalPosition.x,
          y: target.y + this.originalPosition.y,
          z: target.z + this.originalPosition.z,
          easing: 'linear',
          begin: () => {
            this.state = 'moving'
          },
          complete: () => {
            this.camera.updateProjectionMatrix()
            this.state = 'idle'
            resolve()
          }
        })
      })
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canMove = this.state === 'idle' && isVector3(data)

      if (event === 'move' && canMove) {
        await this.move(data)
      }
    }
  }
</script>
