import type { Intersection, Object3D, Scene, Camera, Renderer } from 'three'
import { Raycaster, Vector2 } from 'three'
import { raycasterStore } from '../../stores/threejs/raycaster.store'

interface RaycasterControllerOptions {
	renderer: Renderer
	scene: Scene
	camera: Camera
}

export class RaycasterController {
	private renderer: RaycasterControllerOptions['renderer']
	private scene: RaycasterControllerOptions['scene']
	private camera: RaycasterControllerOptions['camera']
	private mouse: Vector2
	public three: Raycaster
	public intersects: Intersection<Object3D<Event>>[] = []

	constructor({ renderer, scene, camera }: RaycasterControllerOptions) {
		this.renderer = renderer
		this.scene = scene
		this.camera = camera
		this.mouse = new Vector2()
		this.three = new Raycaster()
		this.intersects = []

		addEventListener('mousemove', this.updateMouse.bind(this), false)

		this.render()

		raycasterStore.set(this)
	}

	private updateMouse(event: MouseEvent): void {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		const rect = this.renderer.domElement.getBoundingClientRect()

		this.mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
		this.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1

		this.intersects = this.three.intersectObjects(this.scene.children, false)

		this.update()
	}

	private update(): void {
		// update store
		raycasterStore.update(() => this)
	}

	private render(): void {
		requestAnimationFrame(this.render.bind(this))

		// update the picking ray with the camera and mouse position
		this.three.setFromCamera(this.mouse, this.camera)

		// calculate objects intersecting the picking ray
		this.intersects = this.three.intersectObjects(this.scene.children, false)

		this.update()
	}
}
