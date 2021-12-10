import { MouseHelper } from '$lib/threejs/MouseHelper'
import type {
	BoxGeometry,
	BufferGeometry,
	CircleGeometry,
	CylinderGeometry,
	MeshBasicMaterial,
	MeshDepthMaterial,
	MeshNormalMaterial,
	MeshPhongMaterial,
	MeshPhysicalMaterial,
	MeshStandardMaterial,
	PlaneBufferGeometry,
	PlaneGeometry,
	Scene,
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

export enum InteractionEvent {
	Click = 'click',
	Mousemove = 'mousemove',
	Mouseenter = 'mouseenter',
	Mouseover = 'mouseover',
	Mouseleave = 'mouseleave',
	Touchmove = 'touchmove'
}

export interface MouseEvent {
	mousePosition: {
		x: number
		y: number
	}
	target: Mesh
	scene: Scene
}

export interface MeshControllerOptions extends BaseControllerOptions {
	onClick?: ObjectInteractionFunction<MouseEvent>
	onMouseenter?: ObjectInteractionFunction<MouseEvent>
	onMousemove?: ObjectInteractionFunction<MouseEvent>
	onMouseover?: ObjectInteractionFunction<MouseEvent>
	onMouseleave?: ObjectInteractionFunction<MouseEvent>
	geometry: MeshGeometry
	material: MeshMaterial
}
export type MeshAnimateFunction = AnimateFunction<Mesh>
export type MeshGeometry =
	| BoxGeometry
	| PlaneBufferGeometry
	| PlaneGeometry
	| CylinderGeometry
	| CircleGeometry
	| SphereGeometry
	| BufferGeometry
export type MeshMaterial =
	| MeshPhysicalMaterial
	| MeshPhongMaterial
	| MeshBasicMaterial
	| MeshDepthMaterial
	| MeshStandardMaterial
	| MeshNormalMaterial

export interface MeshInitOptions extends BaseInitOptions {
	geometry: MeshControllerOptions['geometry']
	material: MeshControllerOptions['material']
}
export type MeshUpdateOptions = Omit<Omit<MeshControllerOptions, 'position'>, 'rotation'>
export class MeshController extends BaseController<Mesh> {
	private mouseHelper: MouseHelper
	private onClick?: MeshControllerOptions['onClick']
	private onMouseenter?: MeshControllerOptions['onMouseenter']
	private onMousemove?: MeshControllerOptions['onMousemove']
	private onMouseover?: MeshControllerOptions['onMouseover']
	private onMouseleave?: MeshControllerOptions['onMouseleave']

	constructor(options: MeshControllerOptions) {
		const { name, onClick, onMouseenter, onMousemove, onMouseover, onMouseleave } = options
		super({ name })

		this.mouseHelper = new MouseHelper()
		this.onClick = onClick
		this.onMouseenter = onMouseenter
		this.onMousemove = onMousemove
		this.onMouseover = onMouseover
		this.onMouseleave = onMouseleave

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
		if (this.onClick) {
			this.three.addEventListener(InteractionEvent.Click, () => {
				const mousePosition = this.mouseHelper.getMousePositionInCanvas()

				if (this.onClick && this.isIntersected()) {
					this.onClick({ target: this.three, mousePosition, scene: this.scene })

					this.interactionState = 'interacting'
				}
			})
		}

		if (this.onMouseenter) {
			this.three.addEventListener(InteractionEvent.Mouseenter, () => {
				const mousePosition = this.mouseHelper.getMousePositionInCanvas()

				if (this.onMouseenter && this.isIntersected() && this.interactionState === 'idle') {
					this.onMouseenter({ target: this.three, mousePosition, scene: this.scene})

					this.interactionState = 'interacting'
				}
			})
		}

		if (this.onMousemove) {
			this.three.addEventListener(InteractionEvent.Mousemove, () => {
				if (this.onMousemove) {
					const mousePosition = this.mouseHelper.getMousePositionInCanvas()

					this.onMousemove({ target: this.three, mousePosition, scene: this.scene })
				}
			})
		}

		if (this.onMouseover) {
			this.three.addEventListener(InteractionEvent.Mouseover, () => {
				const mousePosition = this.mouseHelper.getMousePositionInCanvas()

				if (this.onMouseover && this.isIntersected()) {
					this.onMouseover({ target: this.three, mousePosition, scene: this.scene })

					this.interactionState = 'interacting'
				}
			})
		}

		if (this.onMouseleave) {
			this.three.addEventListener(InteractionEvent.Mouseleave, () => {
				const mousePosition = this.mouseHelper.getMousePositionInCanvas()

				if (this.onMouseleave && this.interactionState === 'interacting' && !this.isIntersected()) {
					this.onMouseleave({ target: this.three, mousePosition, scene: this.scene })

					this.interactionState = 'idle'
				}
			})
		}
	}

	private setGeometry(geometry: MeshGeometry): void {
		this.three.geometry = geometry
	}

	private setMaterial(material: MeshMaterial): void {
		this.three.material = material
	}
}
