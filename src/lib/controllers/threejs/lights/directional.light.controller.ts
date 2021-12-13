import type { AnimateFunction } from '$lib/controllers/threejs/base.controller'
import type {
  LightControllerOptions,
  LightHelperOptions,
  LightInitOptions
} from '$lib/controllers/threejs/lights/light.controller'
import { LightController } from '$lib/controllers/threejs/lights/light.controller'
import { DirectionalLight, DirectionalLightHelper } from 'three'

export interface DirectionalLightControllerOptions extends LightControllerOptions {
  targetName: string
  helpers?: DirectionalLightHelperOptions
}

type DirectionalLightHelperOptions = LightHelperOptions

export interface DirectionalLightInitOptions extends LightInitOptions {
  targetName: DirectionalLightControllerOptions['targetName']
  helpers?: DirectionalLightControllerOptions['helpers']
}

export interface DirectionalLightUpdateOptions
  extends Omit<Omit<DirectionalLightControllerOptions, 'position'>, 'rotation'> {
  targetName: DirectionalLightControllerOptions['targetName']
  helpers?: DirectionalLightControllerOptions['helpers']
}

export class DirectionalLightController extends LightController<DirectionalLight> {
  constructor(options: DirectionalLightControllerOptions) {
    const { name, color, intensity } = options
    super({ name })

    this.three = new DirectionalLight(color, intensity)

    this.init(options)

    this.scene.add(this.three)
  }

  protected override init(options: DirectionalLightInitOptions): void {
    this.three.name = options.name

    this.setTarget(options.targetName)

    if (options.helpers) {
      this.setHelpers(options.helpers)
    }

    this.setPosition(options.position)
    this.setShadow(options.shadow)
    this.setColor(options.color)
    this.setRotation(options.rotation)
  }

  public override update(options: DirectionalLightUpdateOptions): void {
    this.setTarget(options.targetName)

    if (options.helpers) {
      this.setHelpers(options.helpers)
    }

    this.setShadow(options.shadow)
    this.setColor(options.color)
  }

  public override animate(animateFunction: AnimateFunction<DirectionalLight>): void {
    requestAnimationFrame(() => this.animate(animateFunction))

    animateFunction(this.three, this.scene)
  }

  private setTarget(targetName: DirectionalLightControllerOptions['targetName']): void {
    const target = this.scene.getObjectByName(targetName)

    if (!target) {
      throw new Error(`Couldn't find target with name: "${targetName}"`)
    }

    if (target) {
      this.three.target = target
    }
  }

  private setHelpers(options: DirectionalLightHelperOptions): void {
    if (options.enabled) {
      const helper = new DirectionalLightHelper(this.three, options.size, options.color)

      this.scene.add(helper)
    }
  }
}