import type { Color } from 'three'
import { HemisphereLight } from 'three'
import type { AnimateFunction } from '../base.controller'
import { LightController, LightControllerOptions, LightInitOptions } from './light.controller'

export interface HemisphereLightControllerOptions extends Omit<LightControllerOptions, 'shadow'> {
	skyColor?: Color
	groundColor?: Color
}

export interface HemisphereLightInitOptions extends LightInitOptions {
	skyColor?: HemisphereLightControllerOptions['skyColor']
	groundColor?: HemisphereLightControllerOptions['groundColor']
}

export interface HemisphereLightUpdateOptions
	extends Omit<Omit<Omit<HemisphereLightControllerOptions, 'scene'>, 'position'>, 'rotation'> {
	skyColor?: HemisphereLightControllerOptions['skyColor']
	groundColor?: HemisphereLightControllerOptions['groundColor']
}

export class HemisphereLightController extends LightController<HemisphereLight> {
	constructor(options: HemisphereLightControllerOptions) {
		const { skyColor, groundColor, intensity } = options
		super(options)

		this.three = new HemisphereLight(skyColor, groundColor, intensity)

		this.init(options)

		this.scene.add(this.three)
	}

	protected override init(options: HemisphereLightInitOptions): void {
		this.setColor(options.color)
		this.setGroundColor(options.groundColor)
		this.setIntensity(options.intensity)
	}

	public override update(options: HemisphereLightUpdateOptions): void {
		this.setColor(options.color)
		this.setGroundColor(options.groundColor)
		this.setIntensity(options.intensity)
	}

	public override animate(animateFunction: AnimateFunction<HemisphereLight>): void {
		requestAnimationFrame(() => this.animate(animateFunction))

		animateFunction(this.three, this.scene)
	}

	private setGroundColor(groundColor: HemisphereLightControllerOptions['groundColor']): void {
		this.three.groundColor = groundColor || this.three.groundColor
	}
}
