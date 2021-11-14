import type { Color, ColorRepresentation } from 'three'
import type { Light } from 'three'
import type { BaseControllerOptions, ShadowOptions, AnimateFunction } from '../base.controller'
import { BaseController } from '../base.controller'

export interface LightControllerOptions extends BaseControllerOptions {
	color?: Color
	intensity?: number
}
export type LightAnimateFunction<T extends Light> = AnimateFunction<T>
export interface LightHelperOptions {
	light?: {
		enabled: boolean
		color?: ColorRepresentation
		size?: number
	}
}

export interface LightShadowOptions extends ShadowOptions {
	mapSize?: {
		width?: number
		height?: number
	}
}

export abstract class LightController<T extends Light> extends BaseController<T> {
	protected setColor(color: LightControllerOptions['color']): void {
		this.three.color = color || this.three.color
	}

	protected setIntensity(intensity: LightControllerOptions['intensity']): void {
		this.three.intensity = intensity || this.three.intensity
	}
}
