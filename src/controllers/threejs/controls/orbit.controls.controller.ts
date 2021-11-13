import { OrbitControls } from '$lib/threejs/OrbitControls'
import type { Camera, MOUSE, Scene, TOUCH } from 'three'

export interface OrbitControlsControllerOptions {
	scene: Scene
	camera: Camera
	targetName?: string
	autoRotate?: boolean
	autoRorateSpeed?: number
	dampingFactor?: number
	domElement: HTMLElement
	enabled?: boolean
	enableDamping?: boolean
	enablePan?: boolean
	enableRotate?: boolean
	enableZoom?: boolean
	keyPanSpeed?: number
	keys?: Keys
	maxAzimuthAngle?: number
	maxDistance?: number
	maxPolarAngle?: number
	maxZoom?: number
	minAzimuthAngle?: number
	minDistance?: number
	minPolarAngle?: number
	minZoom?: number
	mouseButtons?: MouseButtons
	panSpeed?: number
	rotateSpeed?: number
	screenSpacePanning?: boolean
	touches?: Touches
	zoomSpeed?: number
}

interface Keys {
	LEFT: string | 'ArrowLeft'
	UP: string | 'ArrowUp'
	RIGHT: string | 'ArrowRight'
	BOTTOM: string | 'ArrowDown'
}

interface MouseButtons {
	LEFT: MOUSE,
	MIDDLE: MOUSE,
	RIGHT: MOUSE
}

interface Touches {
	ONE: TOUCH,
	TWO: TOUCH
}

export class OrbitControlsController {
	private scene: OrbitControlsControllerOptions['scene']
	public three: OrbitControls

	constructor(options: OrbitControlsControllerOptions) {
		this.scene = options.scene
		this.three = new OrbitControls(options.camera, options.domElement)

		this.three.autoRotate = options.autoRotate || this.three.autoRotate
		this.three.autoRotateSpeed = options.autoRorateSpeed || this.three.autoRotateSpeed
		this.three.dampingFactor = options.dampingFactor || this.three.dampingFactor
		this.three.enableDamping = options.enableDamping || this.three.enableDamping
		this.three.enablePan = options.enablePan || this.three.enablePan
		this.three.enableRotate = options.enableRotate || this.three.enableRotate
		this.three.enableZoom = options.enableZoom || this.three.enableZoom
		this.three.enabled = options.enabled || this.three.enabled
		this.three.keyPanSpeed = options.keyPanSpeed || this.three.keyPanSpeed
		this.three.keys = options.keys || this.three.keys
		this.three.maxAzimuthAngle = options.maxAzimuthAngle || this.three.maxAzimuthAngle
		this.three.maxDistance = options.maxDistance || this.three.maxDistance
		this.three.maxPolarAngle = options.maxPolarAngle || this.three.maxPolarAngle
		this.three.maxZoom = options.maxZoom || this.three.maxZoom
		this.three.minAzimuthAngle = options.minAzimuthAngle || this.three.minAzimuthAngle
		this.three.minDistance = options.minDistance || this.three.minDistance
		this.three.minPolarAngle = options.minPolarAngle || this.three.minPolarAngle
		this.three.minZoom = options.minZoom || this.three.minZoom
		this.three.mouseButtons = options.mouseButtons || this.three.mouseButtons
		this.three.panSpeed = options.panSpeed || this .three.panSpeed
		this.three.rotateSpeed = options.rotateSpeed || this.three.rotateSpeed
		this.three.screenSpacePanning = options.screenSpacePanning || this.three.screenSpacePanning
		this.three.touches = options.touches || this.three.touches
		this.three.zoomSpeed = options.zoomSpeed || this.three.zoomSpeed

		this.setTarget(options.targetName)

		this.renderLoop()
	}

	private renderLoop(): void {
		requestAnimationFrame(() => this.renderLoop())

		this.three.update()
	}

	private setTarget(targetName: OrbitControlsControllerOptions['targetName']): void {
		if (targetName) {
			const target = this.scene.getObjectByName(targetName)

			if (!target) {
				throw new Error(`Couldn't find target with name "${targetName}"`)
			}

			this.three.target = target.position
		}
	}
}
