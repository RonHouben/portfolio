import { AmbientLight } from 'three'
import type { LightControllerOptions } from './light.controller'
import { LightController } from './light.controller'

export type AmbientLightControllerOptions = LightControllerOptions

export class AmbientLightController extends LightController<AmbientLight> {
	constructor(options: AmbientLightControllerOptions) {
		super(options)
		this.three = new AmbientLight(options.color, options.intensity)

		this.update(options)
		this.scene.add(this.three)
	}

	public override update(options: AmbientLightControllerOptions): void {
		this.setColor(options.color)
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)
	}
}
