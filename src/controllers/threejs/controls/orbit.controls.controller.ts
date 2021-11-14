import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import type { Scene } from 'three'

export interface OrbitControlsControllerOptions {
	scene: Scene
	camera: OrbitControls['object']
	targetName?: string
	autoRotate?: OrbitControls['autoRotate']
	autoRorateSpeed?: OrbitControls['autoRotateSpeed']
	dampingFactor?: OrbitControls['dampingFactor']
	domElement: HTMLElement
	enabled?: OrbitControls['enabled']
	enableDamping?: OrbitControls['enableDamping']
	enablePan?: OrbitControls['enablePan']
	enableRotate?: OrbitControls['enableRotate']
	enableZoom?: OrbitControls['enableZoom']
	keyPanSpeed?: OrbitControls['keyPanSpeed']
	keys?: OrbitControls['keys']
	maxAzimuthAngle?: OrbitControls['maxAzimuthAngle']
	maxDistance?: OrbitControls['maxDistance']
	maxPolarAngle?: OrbitControls['maxPolarAngle']
	maxZoom?: OrbitControls['maxZoom']
	minAzimuthAngle?: OrbitControls['minAzimuthAngle']
	minDistance?: OrbitControls['minDistance']
	minPolarAngle?: OrbitControls['minPolarAngle']
	minZoom?: OrbitControls['minZoom']
	mouseButtons?: OrbitControls['mouseButtons']
	panSpeed?: OrbitControls['panSpeed']
	rotateSpeed?: OrbitControls['rotateSpeed']
	screenSpacePanning?: OrbitControls['screenSpacePanning']
	touches?: OrbitControls['touches']
	zoomSpeed?: OrbitControls['zoomSpeed']
}

export class OrbitControlsController {
	private scene: OrbitControlsControllerOptions['scene']
	public three: OrbitControls

	constructor(options: OrbitControlsControllerOptions) {
		this.scene = options.scene
		this.three = new OrbitControls(options.camera, options.domElement)

		this.update(options)

		this.renderLoop()
	}

	public update(options: Omit<Omit<Omit<OrbitControlsControllerOptions, 'scene'>, 'camera'>, 'domElement'>): void {
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
		this.three.panSpeed = options.panSpeed || this.three.panSpeed
		this.three.rotateSpeed = options.rotateSpeed || this.three.rotateSpeed
		this.three.screenSpacePanning = options.screenSpacePanning || this.three.screenSpacePanning
		this.three.touches = options.touches || this.three.touches
		this.three.zoomSpeed = options.zoomSpeed || this.three.zoomSpeed

		this.setTarget(options.targetName)
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

			this.three.target = target.position as unknown as OrbitControls['target']
		}
	}
}
