import { sceneStore } from '../../../stores/threejs/scene.store'
import { get } from 'svelte/store'
import { AnimationClip, Clock, LoopRepeat, Scene } from 'three'
import { AnimationMixer } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'

export interface GLTFLoaderControllerOptions {
	name: string
	path: string
	onLoaded?: (gltf: GLTF) => void
	onProgress?: (event: ProgressEvent<EventTarget>) => void
	onError?: (error: ErrorEvent) => void
}

export class GLTFLoaderController {
	private loader: GLTFLoader
	private scene: Scene
	private three?: GLTF
	private mixer?: AnimationMixer
	private readonly clock: Clock

	constructor({ name, path, onLoaded, onProgress, onError }: GLTFLoaderControllerOptions) {
		const { manager } = get(loadingManagerStore)
		this.loader = new GLTFLoader(manager)
		this.scene = get(sceneStore)
		this.clock = new Clock()

		this.loader.load(
			path,
			(gltf) => {
				this.three = gltf
				this.scene.add(this.three.scene)
				this.three.scene.name = name
				// TOOD: create more config options
				this.three.scene.castShadow = true
				this.three.scene.receiveShadow = true

				if (this.three.animations.length > 0) {
					this.initAnimationMixer(this.three)

					if (this.mixer) {
						this.updateAnimationMixer()
					}
				}

				if (onLoaded) {
					onLoaded(gltf)
				}
			},
			(event) => {
				if (onProgress) {
					onProgress(event)
				}
			},
			(error) => {
				console.error(error)

				if (onError) {
					onError(error)
				}
			}
		)
	}

	private initAnimationMixer(three: GLTF): void {
		this.mixer = new AnimationMixer(three.scene)
	}

	private updateAnimationMixer(): void {
		requestAnimationFrame(this.updateAnimationMixer.bind(this))

		if (this.mixer) {
			const delta = this.clock.getDelta()
			this.mixer.update(delta)
		}
	}

	public playSpecificAnimationClip(name: string): void {
		if (this.three?.animations && this.mixer) {
			const clip = AnimationClip.findByName(this.three.animations, name)
			const action = this.mixer.clipAction(clip)

			action.setLoop(LoopRepeat, -1)
			action.play()
		}
	}

	public playAllAnimations(): void {
		if (this.three?.animations && this.mixer) {
			for (const clip of this.three.animations) {
				this.mixer.clipAction(clip).play()
			}
		}
	}
}
