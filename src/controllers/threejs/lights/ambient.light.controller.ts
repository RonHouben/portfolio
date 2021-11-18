import { AmbientLight } from 'three'
import type { LightControllerOptions, LightInitOptions } from './light.controller'
import { LightController } from './light.controller'

export type AmbientLightControllerOptions = Omit<
	Omit<LightControllerOptions, 'position'>,
	'rotation'
>
export type AmbientLightInitOptions = Omit<Omit<LightInitOptions, 'position'>, 'rotation'>
export type AmbientLightUpdateOptions = Omit<
	Omit<AmbientLightControllerOptions, 'position'>,
	'rotation'
>

export class AmbientLightController extends LightController<AmbientLight> {
	constructor(options: AmbientLightControllerOptions) {
		super(options)
		this.three = new AmbientLight(options.color, options.intensity)

		this.init(options)

		this.scene.add(this.three)
	}

	protected override init(options: AmbientLightInitOptions): void {
		this.three.name = options.name

		this.setColor(options.color)
		this.setShadow(options.shadow)
	}

	public override update(options: Omit<AmbientLightControllerOptions, 'scene'>): void {
		this.setColor(options.color)
		this.setShadow(options.shadow)
	}
}
