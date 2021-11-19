import { sceneStore } from '../../../stores/threejs/scene.store'
import { get } from 'svelte/store'
import type { Scene } from 'three'
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

export interface GLTFLoaderControllerOptions {
	name: string
	path: string
	onLoad?: (gltf: GLTF) => void
	onProgress?: (event: ProgressEvent<EventTarget>) => void
	onError?: (error: ErrorEvent) => void
}

export class GLTFLoaderController {
	private loader: GLTFLoader
	private scene: Scene

	constructor({ name, path, onLoad, onProgress, onError }: GLTFLoaderControllerOptions) {
		this.loader = new GLTFLoader()
		this.scene = get(sceneStore)

		this.loader.load(
			path,
			(gltf) => {
				this.scene.add(gltf.scene)
				gltf.scene.name  = name
				gltf.scene.scale.set(10, 10, 10)

				if (onLoad) {
					onLoad(gltf)
				}
			},
			onProgress,
			(error) => {
				console.error(error)

				if (onError) {
					onError(error)
				}
			}
		)
	}
}
