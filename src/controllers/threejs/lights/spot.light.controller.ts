import { CameraHelper, SpotLight, SpotLightHelper } from 'three'
import type { ColorRepresentation, Object3D } from "three";
import type { LightAnimateOptions, LightControllerOptions, LightHelperOptions, LightShadowOptions } from "./light.controller";
import { LightController } from './light.controller'

export interface SpotLightControllerOptions extends LightControllerOptions {
	distance?: number
	angle?: number
	penumbra?: number
	decay?: number
}

export interface SpotLightAnimateOptions extends LightAnimateOptions {
	target?: Object3D
}

export type SpotLightShadowOptions = LightShadowOptions

export interface SpotLightHelperOptions extends LightHelperOptions {
	shadowCamera?: {
		enabled: boolean
		color?: ColorRepresentation
	}
}

export class SpotLightController extends LightController<SpotLight> {
	constructor({ name, color, intensity, scene, angle, decay, distance, penumbra }: SpotLightControllerOptions) {
		super({ name, scene })

		this.three = new SpotLight(color, intensity, distance, angle, penumbra, decay)

		scene.add(this.three)
	}

	public override shadow(options: SpotLightShadowOptions): void {
		this.three.castShadow = options.castShadow || this.three.castShadow
		this.three.receiveShadow = options.receiveShadow || this.three.receiveShadow
		this.three.shadow.mapSize.width = options.mapSize?.width || this.three.shadow.mapSize.width
		this.three.shadow.mapSize.height = options.mapSize?.height || this.three.shadow.mapSize.height
	}

	public override animate({ target }: SpotLightAnimateOptions): void {
		this.three.target = target || this.three.target
	}

	public setHelpers({ light, shadowCamera }: SpotLightHelperOptions): void {
		if (light?.enabled) {
			const lightHelper = new SpotLightHelper(this.three, light.color)

			this.scene.add(lightHelper)
		}

		if (shadowCamera?.enabled) {
			const shadowCameraHelper = new CameraHelper(this.three.shadow.camera)

			this.scene.add(shadowCameraHelper)
		}
	}

}