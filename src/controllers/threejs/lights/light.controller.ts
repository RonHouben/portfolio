import type {ColorRepresentation} from 'three'
import type { Light } from 'three'
import type { BaseControllerOptions, ShadowOptions, AnimateFunction } from '../base.controller'
import { BaseController } from '../base.controller'

export interface LightControllerOptions extends BaseControllerOptions {
	color?: ColorRepresentation
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
	public abstract setHelpers(options: LightHelperOptions): void
}
