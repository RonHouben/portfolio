<script lang="ts" context="module">
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { PerspectiveCamera, Vector3 } from 'three'

  @Singleton
  export class CameraController {
    private name: string
    private camera: PerspectiveCamera
    private originalPosition: { x: number; y: number; z: number }

    constructor(name: string) {
      this.name = name

      this.camera = this.getCamera()

      const { x, y, z } = this.camera.position
      this.originalPosition = { x, y, z }
    }

    private getCamera(): PerspectiveCamera {
      return get(cameraStore)
    }

    public async move({ x, y, z }: Vector3): Promise<void> {
      return new Promise((resolve) => {
        anime({
          targets: this.camera.position,
          x,
          y: y + this.originalPosition.y,
          z: z + this.originalPosition.z,
          easing: 'linear',
          complete: () => {
            this.camera.updateProjectionMatrix()
						resolve()
          }
        })
      })
    }
  }
</script>
