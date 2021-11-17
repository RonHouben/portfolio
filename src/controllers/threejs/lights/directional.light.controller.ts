import { DirectionalLight, DirectionalLightHelper } from 'three'
import type {
	LightControllerOptions,
	LightHelperOptions,
	LightInitOptions
} from './light.controller'
import { LightController } from './light.controller'

export interface DirectionalLightControllerOptions extends LightControllerOptions {
	targetName: string
	helpers?: DirectionalLightHelperOptions
}

type DirectionalLightHelperOptions = LightHelperOptions

export interface DirectionalLightInitOptions extends LightInitOptions<DirectionalLight> {
	targetName: DirectionalLightControllerOptions['targetName']
	helpers?: DirectionalLightControllerOptions['helpers']
}

export interface DirectionalLightUpdateOptions
	extends Omit<Omit<Omit<DirectionalLightControllerOptions, 'scene'>, 'position'>, 'rotation'> {
	targetName: DirectionalLightControllerOptions['targetName']
	helpers?: DirectionalLightControllerOptions['helpers']
}

export class DirectionalLightController extends LightController<DirectionalLight> {
	constructor(options: DirectionalLightControllerOptions) {
		const { name, scene, color, intensity } = options
		super({ name, scene })

		this.three = new DirectionalLight(color, intensity)

		this.init(options)

		this.scene.add(this.three)
	}

	protected override init(options: DirectionalLightInitOptions): void {
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

	private setTarget(targetName: DirectionalLightControllerOptions['targetName']): void {
		const target = this.scene.getObjectByName(targetName)

		if (target) {
			this.three.target = target
		}
	}

	private setHelpers(options: DirectionalLightHelperOptions): void {
		if (options.light && options.light.enabled) {
			const helper = new DirectionalLightHelper(this.three, options.light.size, options.light.color)

			this.scene.add(helper)
		}
	}
}
