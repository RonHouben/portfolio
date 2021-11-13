import type { ColorRepresentation } from 'three'
import { DirectionalLight, DirectionalLightHelper } from 'three'
import type {
	LightAnimateOptions,
	LightControllerOptions,
	LightHelperOptions
} from './light.controller'
import { LightController } from './light.controller'

export type DirectionalLightControllerOptions = LightControllerOptions

export interface DirectionalLightHelperOptions extends LightHelperOptions {
	light?: {
		color?: ColorRepresentation
		size?: number
		enabled: boolean
	}
}

export interface DirectionalLightAnimateOptions extends LightAnimateOptions {
	targetName: string
}

export class DirectionalLightController extends LightController<DirectionalLight> {
	constructor({ name, scene, color, intensity }: DirectionalLightControllerOptions) {
		super({ name, scene })

		this.three = new DirectionalLight(color, intensity)

		this.scene.add(this.three)
	}

	public override setHelpers({ light }: DirectionalLightHelperOptions): void {
		if (light?.enabled) {
			const helper = new DirectionalLightHelper(this.three, light.size, light.color)

			this.scene.add(helper)
		}
	}

	public override animate(options: DirectionalLightAnimateOptions): void {
		if (options.targetName) {
			const target = this.scene.getObjectByName(options.targetName)

			if (target) {
				this.three.target = target
			}
		}
	}
}
