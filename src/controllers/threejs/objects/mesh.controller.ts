import type {
	BoxGeometry,
	BufferGeometry,
	CircleGeometry,
	CylinderGeometry,
	MeshBasicMaterial,
	MeshPhongMaterial,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	PlaneGeometry,
	SphereGeometry
} from 'three'
import { Mesh } from 'three'
import type {
	AnimateFunction,
	BaseControllerOptions,
	OnMousemoveFunction
} from '../base.controller'
import { BaseController } from '../base.controller'

export interface MeshControllerOptions extends BaseControllerOptions {
	geometry: MeshGeometry
	material: MeshMaterial
}

export type MeshAnimateFunction = AnimateFunction<Mesh<MeshGeometry, MeshMaterial>>
export type MeshOnMousemoveFunction = OnMousemoveFunction<Mesh<MeshGeometry, MeshMaterial>>

export type MeshGeometry =
	| BoxGeometry
	| PlaneBufferGeometry
	| PlaneGeometry
	| CylinderGeometry
	| CircleGeometry
	| SphereGeometry
	| BufferGeometry

export type MeshMaterial = MeshPhongMaterial | MeshBasicMaterial | MeshStandardMaterial

export class MeshController extends BaseController<Mesh<MeshGeometry, MeshMaterial>> {
	constructor(options: MeshControllerOptions) {
		super({ name: options.name, scene: options.scene })

		this.three = new Mesh(options.geometry, options.material)
		this.three.name = options.name

		this.update(options)

		this.scene.add(this.three)
	}

	public override update(options: MeshControllerOptions): void {
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)
		this.setMaterial(options.material)
	}

	private setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
