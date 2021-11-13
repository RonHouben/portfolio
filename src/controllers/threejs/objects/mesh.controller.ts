import type {
	BoxGeometry,
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

interface MeshControllerOptions extends BaseControllerOptions {
	geometry: Geometry
	material: MeshMaterial
}

export type MeshAnimateFunction = AnimateFunction<Mesh>
export type MeshOnMousemoveFunction = OnMousemoveFunction<Mesh>

export type Geometry =
	| BoxGeometry
	| PlaneBufferGeometry
	| PlaneGeometry
	| CylinderGeometry
	| CircleGeometry
	| SphereGeometry
export type MeshMaterial = MeshBasicMaterial | MeshStandardMaterial | MeshPhongMaterial

export class MeshController extends BaseController<Mesh> {
	constructor({ name, geometry, material, scene }: MeshControllerOptions) {
		super({ name, scene })

		this.three = new Mesh(geometry, material)
		this.three.name = name

		this.scene.add(this.three)
	}

	public setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
