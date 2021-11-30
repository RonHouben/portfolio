import { get } from 'svelte/store'
import type { Camera, Intersection, Object3D, Renderer, Scene } from 'three'
import { Raycaster, Vector2 } from 'three'
import { raycasterStore } from '../../stores/threejs/raycaster.store'
import { rendererStore } from '../../stores/threejs/renderer.store'
import { sceneStore } from '../../stores/threejs/scene.store'

export interface RaycasterControllerOptions {
	cameraName: string
}

export class RaycasterController {
	private renderer: Renderer
	private scene: Scene
	private camera: Camera
	private mouse: Vector2
	public three: Raycaster
	public intersects: Intersection<Object3D<Event>>[] = []

	constructor({ cameraName }: RaycasterControllerOptions) {
		this.renderer = get(rendererStore)
		this.scene = get(sceneStore)
		this.mouse = new Vector2()
		this.three = new Raycaster()
		this.intersects = []

		this.camera = this.getCamera(cameraName)

		addEventListener('mousemove', this.updateMouse.bind(this), false)
		addEventListener('touchmove', this.updateMouse.bind(this), false)

		this.render()

		// set Svelte store
		raycasterStore.set({
			intersects: this.intersects,
			raycaster: this.three
		})
	}

	private getCamera<T extends Camera>(cameraName: RaycasterControllerOptions['cameraName']): T {
		const camera = this.scene.getObjectByName(cameraName) as T | undefined

		if (!camera) {
			throw new Error(`Couldn't find camera with name: "${cameraName}"`)
		}

		return camera
	}

	private updateMouse(event: MouseEvent | TouchEvent): void {
		// calculate mouse position in normalized device coordinates
		// (-1 to +1) for both components
		const rect = this.renderer.domElement.getBoundingClientRect()

		if (event instanceof MouseEvent) {
			this.mouse.x = ((event.clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
			this.mouse.y = -((event.clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1
		}

		if (event instanceof TouchEvent) {
			this.mouse.x = ((event.touches[0].clientX - rect.left) / (rect.right - rect.left)) * 2 - 1
			this.mouse.y = -((event.touches[0].clientY - rect.top) / (rect.bottom - rect.top)) * 2 + 1
		}

		this.update()
	}

	private update(): void {
		this.intersects = this.three.intersectObjects(this.scene.children, false)

		// update store
		raycasterStore.update(() => ({
			intersects: this.intersects,
			raycaster: this.three
		}))
	}

	private render(): void {
		requestAnimationFrame(this.render.bind(this))

		// update the picking ray with the camera and mouse position
		this.three.setFromCamera(this.mouse, this.camera)

		this.update()
	}
}
