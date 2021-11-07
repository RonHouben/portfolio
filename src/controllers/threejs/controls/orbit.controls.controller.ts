import { OrbitControls } from '$lib/threejs/OrbitControls'
import type { Camera, Vector3 } from 'three'

interface OrbitControlsControllerOptions {
	domElement: HTMLElement
	camera: Camera
}

export interface OrbitControlsDampingOptions {
	enableDamping?: boolean
}

export interface OrbitControlsAnimationOptions {
	target?: Vector3
	autoRotate?: boolean
	autoRotateSpeed?: number
}

export class OrbitControlsController {
	public three: OrbitControls

	constructor({ camera, domElement }: OrbitControlsControllerOptions) {
		this.three = new OrbitControls(camera, domElement)

		this.three.update()
	}

	public animate(options: OrbitControlsAnimationOptions): void {
		requestAnimationFrame(() => this.animate(options))

		this.three.autoRotate = options.autoRotate || false
		this.three.autoRotateSpeed = options.autoRotateSpeed || 0
		this.three.target = options.target || this.three.target

		this.three.update()
	}

	public dampingOptions(options: OrbitControlsDampingOptions): void {
		this.three.enableDamping = options.enableDamping || this.three.autoRotate
	}
}
