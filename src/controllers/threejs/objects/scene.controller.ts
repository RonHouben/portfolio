import type { Fog, Color, Material, Texture } from "three";
import { Scene } from 'three'
import { sceneStore } from "../../../stores/threejs/scene.store";
import type { BaseControllerOptions } from '../base.controller'
import { BaseController } from "../base.controller";

type PartialBaseControllerOptions = Pick<BaseControllerOptions<Scene>, 'name'>

export interface SceneControllerOptions extends PartialBaseControllerOptions {
	autoUpdate?: boolean
	background?: Color | Texture
	environment?: Texture
	fog?: Fog
	overrideMaterial?: Material
}

export class SceneController extends BaseController<Scene> {
	constructor(options: SceneControllerOptions) {
		super({ ...options, scene: new Scene() })

		this.three = this.scene

		this.update(options)

		sceneStore.set(this.three)
	}

	public override update(options: SceneControllerOptions): void {
		this.setAutoUpdate(options.autoUpdate)
		this.setBackground(options.background)
		this.setEnvironment(options.environment)
		this.setFog(options.fog)
		this.setOverrideMaterial(options.overrideMaterial)
	}
	
	private setAutoUpdate(autoUpdate: SceneControllerOptions['autoUpdate']): void {
		this.three.autoUpdate = autoUpdate || this.three.autoUpdate
	}

	private setBackground(background: SceneControllerOptions['background']): void {
		this.three.background = background || this.three.background
	}

	private setEnvironment(environment: SceneControllerOptions['environment']): void {
		this.three.environment = environment || this.three.environment
	}

	private setFog(fog: SceneControllerOptions['fog']): void {
		this.three.fog = fog || this.three.fog
	}

	private setOverrideMaterial(overrideMaterial: SceneControllerOptions['overrideMaterial']): void {
		this.three.overrideMaterial = overrideMaterial || this.three.overrideMaterial
	}
}