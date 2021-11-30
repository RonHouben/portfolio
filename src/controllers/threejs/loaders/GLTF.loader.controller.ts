import { get } from 'svelte/store'
import type { Scene } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'
import { sceneStore } from '../../../stores/threejs/scene.store'

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

	constructor({ name, path, onLoaded, onProgress, onError }: GLTFLoaderControllerOptions) {
		const { manager } = get(loadingManagerStore)
		this.loader = new GLTFLoader(manager)
		this.scene = get(sceneStore)

		this.loader.load(
			path,
			(gltf) => {
				this.three = gltf

				this.scene.add(this.three.scene)
				this.three.scene.name = name
				this.three.scene.animations = this.three.animations
				// TODO: create more config options
				this.three.scene.castShadow = true
				this.three.scene.receiveShadow = true

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
}
