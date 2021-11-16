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
	ObjectInteractionFunction
} from '../base.controller'
import { BaseController } from '../base.controller'
import type { RaycasterController } from '../raycaster.controller'

export interface MeshControllerOptions
	extends BaseControllerOptions<Mesh<MeshGeometry, MeshMaterial>> {
	geometry: MeshGeometry
	material: MeshMaterial
}

export type MeshAnimateFunction = AnimateFunction<Mesh<MeshGeometry, MeshMaterial>>
export type MeshObjectInteractionFunction = ObjectInteractionFunction<
	Mesh<MeshGeometry, MeshMaterial>
>

export type MeshGeometry =
	| BoxGeometry
	| PlaneBufferGeometry
	| PlaneGeometry
	| CylinderGeometry
	| CircleGeometry
	| SphereGeometry
	| BufferGeometry

export type MeshMaterial = MeshPhongMaterial | MeshBasicMaterial | MeshStandardMaterial

interface UpdateOptions extends Omit<MeshControllerOptions, 'scene'> {
	raycasterIntersects: RaycasterController['intersects']
}

export class MeshController extends BaseController<Mesh<MeshGeometry, MeshMaterial>> {
	constructor(options: MeshControllerOptions) {
		const { name, scene, onClick, geometry, material } = options
		super({
			name,
			scene,
			onClick
		})

		this.three = new Mesh(geometry, material)
		this.three.name = name

		this.update({ ...options, raycasterIntersects: [] })
		this.addEventListeners()

		this.scene.add(this.three)
	}

	public override update(options: UpdateOptions): void {
		this.raycasterIntersects = options.raycasterIntersects
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)
		this.setMaterial(options.material)
	}

	private setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
