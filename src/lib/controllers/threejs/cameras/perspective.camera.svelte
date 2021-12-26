<script lang="ts" context="module">
  import type { AnimateFunction } from '$lib/controllers/threejs/base.controller.svelte'
  import type {
    CameraAnimateFunction,
    CameraControllerOptions,
    CameraInitOptions,
    CameraUpdateOptions
  } from '$lib/controllers/threejs/cameras/camera.controller.svelte'
  import { CameraController } from '$lib/controllers/threejs/cameras/camera.controller.svelte'
  import { CameraHelperController } from '$lib/controllers/threejs/helpers/camera.helper.controller.svelte'
  import { perspectiveCameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import type { Scene } from 'three'
  import { PerspectiveCamera } from 'three'

  export interface PerspectiveCameraControllerOptions extends CameraControllerOptions {
    fov?: number
    aspect?: number
    near?: number
    far?: number
    focus?: number
    lookAt?: string
  }
  export type PerspectiveCameraAnimateFunction = CameraAnimateFunction<PerspectiveCamera>
  export type PerspectiveCameraInitOptions = CameraInitOptions
  export type PerspectiveCameraUpdateOptions = CameraUpdateOptions
  export class PerspectiveCameraController extends CameraController<PerspectiveCamera> {
    protected interactable: PerspectiveCamera
    // protected interactable: PerspectiveCamera
    public three: PerspectiveCamera

    constructor(scene: Scene, options: PerspectiveCameraControllerOptions) {
      const { fov, aspect, near, far } = options
      super(scene, options)

      this.three = new PerspectiveCamera(fov, aspect, near, far)
      this.interactable = this.three

      this.init(options)

      this.scene.add(this.three)

      perspectiveCameraStore.set(this.three)

      this.renderLoop(options)
    }

    protected override init({
      name,
      position,
      rotation,
      shadow,
      helpers,
      lookAt
    }: PerspectiveCameraControllerOptions): void {
      this.three.name = name

      this.setPosition(position)
      this.setRotation(rotation)
      this.setShadow(shadow)
      this.enableHelpers(helpers)
      this.setCamera()
      this.setLookAt(lookAt)

      this.three.updateProjectionMatrix()
    }

    private renderLoop(options: PerspectiveCameraControllerOptions): void {
      requestAnimationFrame(() => this.renderLoop(options))

      this.setLookAt(options.lookAt)
      this.three.updateProjectionMatrix()

      perspectiveCameraStore.update(() => this.three)
    }

    public override animate(animateFunction: AnimateFunction<PerspectiveCamera>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }

    protected override enableHelpers(helpers: PerspectiveCameraControllerOptions['helpers']): void {
      if (helpers?.enable) {
        new CameraHelperController(this.scene, this.three)
      }
    }

    private setLookAt(lookAt: PerspectiveCameraControllerOptions['lookAt']): void {
      if (lookAt) {
        const target = this.scene.getObjectByName(lookAt)

        if (!target) {
          throw new Error(`Unabled to find lookAt target with name: "${lookAt}"`)
        }

        this.three.lookAt(target.position)
      }
    }

    updateOptions(options: PerspectiveCameraControllerOptions): void {
      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setShadow(options.shadow)
      this.enableHelpers(options.helpers)
      this.setCamera()
      this.setLookAt(options.lookAt)

      this.three.updateProjectionMatrix()
    }
  }
</script>
