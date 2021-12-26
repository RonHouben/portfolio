<script lang="ts" context="module">
  import type { AnimateFunction } from '$lib/controllers/threejs/base.controller.svelte'
  import type {
    LightAnimateFunction,
    LightControllerOptions,
    LightHelperOptions,
    LightInitOptions,
    LightShadowOptions
  } from '$lib/controllers/threejs/lights/light.controller.svelte'
  import { LightController } from '$lib/controllers/threejs/lights/light.controller.svelte'
  import type { ColorRepresentation } from 'three'
  import { CameraHelper, SpotLight, SpotLightHelper } from 'three'

  export interface SpotLightControllerOptions extends LightControllerOptions<SpotLight> {
    targetName?: string
    distance?: number
    angle?: number
    penumbra?: number
    decay?: number
    shadow?: SpotLightShadowOptions
    helpers?: SpotLightHelperOptions
  }

  export type SpotLightAnimateFunction = LightAnimateFunction<SpotLight>
  export type SpotLightShadowOptions = LightShadowOptions

  export interface SpotLightHelperOptions extends LightHelperOptions {
    shadowCamera?: {
      enabled: boolean
      color?: ColorRepresentation
    }
  }

  export interface SpotLightInitOptions extends LightInitOptions<SpotLight> {
    targetName?: SpotLightControllerOptions['targetName']
    distance?: SpotLightControllerOptions['distance']
    angle?: SpotLightControllerOptions['angle']
    penumbra?: SpotLightControllerOptions['penumbra']
    decay?: SpotLightControllerOptions['decay']
    shadow?: SpotLightControllerOptions['shadow']
    helpers?: SpotLightControllerOptions['helpers']
  }

  export interface SpotLightUpdateOptions
    extends Omit<Omit<Omit<SpotLightControllerOptions, 'scene'>, 'position'>, 'rotation'> {
    targetName?: SpotLightControllerOptions['targetName']
    distance?: SpotLightControllerOptions['distance']
    angle?: SpotLightControllerOptions['angle']
    penumbra?: SpotLightControllerOptions['penumbra']
    decay?: SpotLightControllerOptions['decay']
    shadow?: SpotLightControllerOptions['shadow']
    helpers?: SpotLightControllerOptions['helpers']
  }

  export class SpotLightController extends LightController<SpotLight> {
    public three: SpotLight;
    protected interactable: SpotLight;


    constructor(options: SpotLightControllerOptions) {
      const { name, color, intensity, distance, angle, penumbra, decay } = options
      super({ name })

      this.three = new SpotLight(color, intensity, distance, angle, penumbra, decay)
      this.interactable = this.three

      this.init(options)

      this.scene.add(this.three)
    }

    protected override init(options: SpotLightInitOptions): void {
      this.three.name = options.name

      this.setColor(options.color)
      this.setHelpers(options.helpers)
      this.setIntensity(options.intensity)
      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setShadow(options.shadow)
      this.setTarget(options.targetName)
    }

    public override updateOptions(options: SpotLightUpdateOptions): void {
      this.setColor(options.color)
      this.setHelpers(options.helpers)
      this.setIntensity(options.intensity)
      this.setShadow(options.shadow)
      this.setTarget(options.targetName)
    }

    public override animate(animateFunction: AnimateFunction<SpotLight>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }

    protected override setShadow(options: SpotLightControllerOptions['shadow']): void {
      if (options) {
        this.three.castShadow = options.castShadow || this.three.castShadow
        this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
        this.three.shadow.mapSize.width = options.mapSize?.width || this.three.shadow.mapSize.width
        this.three.shadow.mapSize.height =
          options.mapSize?.height || this.three.shadow.mapSize.height
      }
    }

    private setHelpers(options: SpotLightControllerOptions['helpers']): void {
      if (options?.enabled) {
        const lightHelper = new SpotLightHelper(this.three, options.color)

        this.scene.add(lightHelper)
      }

      if (options && options.shadowCamera?.enabled) {
        const shadowCameraHelper = new CameraHelper(this.three.shadow.camera)

        this.scene.add(shadowCameraHelper)
      }
    }

    private setTarget(targetName: SpotLightControllerOptions['targetName']): void {
      if (targetName) {
        const target = this.scene.getObjectByName(targetName)

        if (!target) {
          throw new Error(`Couldn't find target with name: "${targetName}"`)
        }

        if (target) {
          this.three.target = target
        }
      }
    }
  }
</script>
