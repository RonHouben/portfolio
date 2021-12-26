<script lang="ts" context="module">
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
	import { isVector3, Vector3 } from '$lib/utils/math/vector3.svelte';
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { PerspectiveCamera } from 'three'

	type State = 'idle' | 'moving'
	type Event = 'move'

  @Singleton
  export class CameraController {
		private state: State
    private name: string
    private camera: PerspectiveCamera
    private originalPosition: { x: number; y: number; z: number }

    constructor(name: string) {
			this.state = 'idle'
      this.name = name

      this.camera = this.getCamera()

      const { x, y, z } = this.camera.position
      this.originalPosition = { x, y, z }
    }

    private getCamera(): PerspectiveCamera {
      return get(cameraStore)
    }

    private async move({ x, y, z }: Vector3): Promise<void> {
			this.state = 'moving'

      return new Promise((resolve) => {
        anime({
          targets: this.camera.position,
          x: x ? x + this.originalPosition.x : undefined,
          y: y ? y + this.originalPosition.y : undefined,
          z: z ? z + this.originalPosition.z : undefined,
          easing: 'linear',
          complete: () => {
            this.camera.updateProjectionMatrix()

						this.state ='idle'
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
