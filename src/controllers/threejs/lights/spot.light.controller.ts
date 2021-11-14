import { CameraHelper, SpotLight, SpotLightHelper } from 'three'
import type { ColorRepresentation } from 'three'
import type {
	LightAnimateFunction,
	LightControllerOptions,
	LightHelperOptions,
	LightShadowOptions
} from './light.controller'
import { LightController } from './light.controller'

export interface SpotLightControllerOptions extends LightControllerOptions {
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

export class SpotLightController extends LightController<SpotLight> {
	constructor(options: SpotLightControllerOptions) {
		const { name, scene, color, intensity, distance, angle, penumbra, decay } = options
		super({ name, scene })

		this.three = new SpotLight(color, intensity, distance, angle, penumbra, decay)

		this.update(options)

		scene.add(this.three)
	}

	public override update(options: SpotLightControllerOptions): void {
		this.setColor(options.color)
		this.setHelpers(options.helpers)
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)
		this.setTarget(options.targetName)
	}

	protected override setShadow(options: SpotLightControllerOptions['shadow']): void {
		if (options) {
			this.three.castShadow = options.castShadow || this.three.castShadow
			this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
			this.three.shadow.mapSize.width = options.mapSize?.width || this.three.shadow.mapSize.width
			this.three.shadow.mapSize.height = options.mapSize?.height || this.three.shadow.mapSize.height
		}
	}

	private setHelpers(options: SpotLightControllerOptions['helpers']): void {
		if (options && options.light?.enabled) {
			const lightHelper = new SpotLightHelper(this.three, options.light.color)

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

			if (target) {
				this.three.target = target
			}
		}
	}
}
