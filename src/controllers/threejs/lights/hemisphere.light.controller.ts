import type { Color } from 'three'
import { HemisphereLight } from 'three'
import { LightController, LightControllerOptions } from './light.controller'

export interface HemisphereLightControllerOptions extends Omit<LightControllerOptions, 'shadow'> {
	skyColor?: Color
	groundColor?: Color
}

export class HemisphereLightController extends LightController<HemisphereLight> {
	constructor(options: HemisphereLightControllerOptions) {
		const { skyColor, groundColor, intensity } = options
		super(options)

		this.three = new HemisphereLight(skyColor, groundColor, intensity)

		this.update(options)

		this.scene.add(this.three)
	}

	public override update(options: Omit<HemisphereLightControllerOptions, 'scene'>): void {
		this.setColor(options.color)
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setGroundColor(options.groundColor)
		this.setIntensity(options.intensity)
	}

	private setGroundColor(groundColor: HemisphereLightControllerOptions['groundColor']): void {
		this.three.groundColor = groundColor || this.three.groundColor
	}
}
