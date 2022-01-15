<script lang="ts" context="module">
  import { perspectiveCameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
  import { StateMachine } from '$lib/utils/StateMachine.svelte'
  import anime from 'animejs'
  import { get } from 'svelte/store'
  import type { PerspectiveCamera } from 'three'
  import { Vector3 as ThreeVector3 } from 'three'

  interface StateEventMapping {
    idle: 'move'
    moving: 'move' | 'stop-moving'
  }
  type Events = 'move' | 'stop-moving'

  interface Animations {
    moving?: anime.AnimeInstance
  }

  export class CameraController {
    private readonly stateMachine: StateMachine<StateEventMapping, Events>
    private camera: PerspectiveCamera
    private originalPosition: { x: number; y: number; z: number }
    private animations: Animations = {}

    constructor() {
      this.stateMachine = new StateMachine({
        id: 'cameraMachine',
        initial: 'idle',
        states: {
          idle: {
            move: {
              target: 'moving'
            }
          },
          moving: {
            entry: (data) => this.move(data),
            move: {
              target: 'moving'
            },
            'stop-moving': {
              target: 'idle',
              action: () => this.stopMoving()
            }
          }
        }
      })

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
        this.animations.moving = anime({
          targets: this.camera.position,
          x: target.x + this.originalPosition.x,
          y: target.y + this.originalPosition.y,
          z: target.z + this.originalPosition.z,
          easing: 'linear',
          complete: () => {
            this.camera.updateProjectionMatrix()

            delete this.animations.moving
            resolve()
          }
        })
      })
    }

    private stopMoving(): void {
      this.animations.moving?.pause()
    }

    public async send<T>(event: Events, data?: T): Promise<void> {
      this.stateMachine.send(event, data)
    }
  }
</script>
