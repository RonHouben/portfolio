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
	SphereGeometry,
} from 'three'
import { Mesh as ThreeMesh } from 'three'
import type {
	AnimateFunction,
	BaseControllerOptions,
	BaseInitOptions,
	ObjectInteractionFunction
} from '../base.controller'
import { BaseController } from '../base.controller'
import type { RaycasterController } from '../raycaster.controller'

type Mesh = ThreeMesh<MeshGeometry, MeshMaterial>

export interface MeshControllerOptions
	extends BaseControllerOptions<Mesh> {
	geometry: MeshGeometry
	material: MeshMaterial
}

export type MeshAnimateFunction = AnimateFunction<Mesh>
export type MeshObjectInteractionFunction = ObjectInteractionFunction<Mesh>

export type MeshGeometry =
	| BoxGeometry
	| PlaneBufferGeometry
	| PlaneGeometry
	| CylinderGeometry
	| CircleGeometry
	| SphereGeometry
	| BufferGeometry

export type MeshMaterial = MeshPhongMaterial | MeshBasicMaterial | MeshStandardMaterial

export interface MeshInitOptions extends BaseInitOptions<Mesh> {
	geometry: MeshControllerOptions['geometry']
	material: MeshControllerOptions['material']
} 

export interface MeshUpdateOptions extends Omit<Omit<Omit<MeshControllerOptions, 'scene'>, 'position'>, 'rotation'> {
	raycasterIntersects: RaycasterController['intersects']
}

export class MeshController extends BaseController<Mesh> {
	constructor(options: MeshControllerOptions) {
		const { name, scene, onClick, geometry, material } = options
		super({
			name,
			scene,
			onClick
		})

		this.three = new ThreeMesh(geometry, material)
		this.three.name = name

		this.init(options)
	}

	protected override init(options: MeshInitOptions): void {
		this.addEventListeners()
		this.setGeometry(options.geometry)
		this.setMaterial(options.material)
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)

		this.scene.add(this.three)
	}

	public override update(options: MeshUpdateOptions): void {
		this.raycasterIntersects = options.raycasterIntersects
		this.setShadow(options.shadow)
		this.setMaterial(options.material)
		this.setGeometry(options.geometry)
	}

	private setGeometry(geometry: MeshGeometry): void {
		this.three.geometry = geometry
	}

	private setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
