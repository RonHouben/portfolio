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
import { Mesh as ThreeMesh } from 'three'
import type {
	AnimateFunction,
	BaseControllerOptions,
	BaseInitOptions,
	ObjectInteractionFunction
} from '../base.controller'
import { BaseController } from '../base.controller'

type Mesh = ThreeMesh<MeshGeometry, MeshMaterial>
export interface MeshControllerOptions extends BaseControllerOptions {
	onClick?: ObjectInteractionFunction<Mesh>
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
export interface MeshInitOptions extends BaseInitOptions {
	onClick?: MeshControllerOptions['onClick']
	geometry: MeshControllerOptions['geometry']
	material: MeshControllerOptions['material']
}
export type MeshUpdateOptions = Omit<Omit<MeshControllerOptions, 'position'>, 'rotation'>
export class MeshController extends BaseController<Mesh> {
	private onClick?: MeshControllerOptions['onClick']

	constructor(options: MeshControllerOptions) {
		const { name, onClick } = options
		super({ name })

		this.onClick = onClick

		this.init(options)
	}

	protected override init(options: MeshInitOptions): void {
		this.three = new ThreeMesh(options.geometry, options.material)
		this.three.name = options.name
		this.addEventListeners()
		this.setGeometry(options.geometry)
		this.setMaterial(options.material)
		this.setPosition(options.position)
		this.setRotation(options.rotation)
		this.setShadow(options.shadow)

		this.scene.add(this.three)
	}

	public override update(options: MeshUpdateOptions): void {
		this.setShadow(options.shadow)
		this.setMaterial(options.material)
		this.setGeometry(options.geometry)
	}
	
	public override animate(animateFunction: AnimateFunction<Mesh>): void {
		requestAnimationFrame(() => this.animate(animateFunction))

		animateFunction(this.three, this.scene)
	}

	protected addEventListeners(): void {
		this.three.addEventListener('click', () => {
			if (this.onClick && this.isIntersected()) {
				this.onClick(this.three, this.scene)
			}
		})
	}

	private setGeometry(geometry: MeshGeometry): void {
		this.three.geometry = geometry
	}

	private setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
