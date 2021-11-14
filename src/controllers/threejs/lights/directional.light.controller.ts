import { DirectionalLight, DirectionalLightHelper } from 'three'
import type {
	LightControllerOptions,
	LightHelperOptions
} from './light.controller'
import { LightController } from './light.controller'

export interface DirectionalLightControllerOptions extends LightControllerOptions {
	targetName: string
	helpers: DirectionalLightHelperOptions
}

type DirectionalLightHelperOptions = LightHelperOptions 

export class DirectionalLightController extends LightController<DirectionalLight> {
	constructor(options: DirectionalLightControllerOptions) {
		const { name, scene, color, intensity } = options
		super({ name, scene })

		this.three = new DirectionalLight(color, intensity)

		this.update(options)

		this.scene.add(this.three)
	}

	public override update(options: DirectionalLightControllerOptions): void {
		this.setTarget(options.targetName)
		this.setHelpers(options.helpers)
		this.setPosition(options.position)
		this.setShadow(options.shadow)
		this.setColor(options.color)
		this.setRotation(options.rotation)
	}

	private setTarget(targetName: DirectionalLightControllerOptions['targetName']): void {
			const target = this.scene.getObjectByName(targetName)

			if (target) {
				this.three.target = target
			}

	}

	private setHelpers({ light }: DirectionalLightHelperOptions): void {
		if (light && light.enabled) {
			const helper = new DirectionalLightHelper(this.three, light.size, light.color)

			this.scene.add(helper)
		}
	}
}
