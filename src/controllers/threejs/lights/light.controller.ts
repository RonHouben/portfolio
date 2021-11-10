import type {Color, ColorRepresentation} from 'three'
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
	}
}

export interface LightShadowOptions extends ShadowOptions {
	mapSize?: {
		width?: number
		height?: number
	}
}

export abstract class LightController<T extends Light> extends BaseController<T> {
	public setColor(color: Color): void {
		this.three.color = color
	}
	public abstract setHelpers(options: LightHelperOptions): void
}
