import { renderer } from '../../../stores/threejs/renderer.store'
import type {
	PerspectiveCamera,
	Scene,
	TextureEncoding,
	WebGLRendererParameters,
	WebGLShadowMap
} from 'three'
import { WebGL1Renderer, WebGLRenderer } from 'three'

export interface RendererControllerOptions {
	scene: Scene
	camera: PerspectiveCamera
	options?: WebGLRendererParameters
	domElementId?: string
	width?: number
	height?: number
	shadowMap?: RendererShadowMapOptions
	outputEncoding?: TextureEncoding
	pixelRatio?: number
}

type RendererShadowMapOptions = Pick<WebGLShadowMap, 'enabled'> & Pick<WebGLShadowMap, 'type'>
export enum RendererType {
	webGL,
	webGL1
}

export class RendererController {
	private scene: RendererControllerOptions['scene']
	private camera: RendererControllerOptions['camera']
	private width: RendererControllerOptions['width']
	private height: RendererControllerOptions['height']
	public three: WebGLRenderer | WebGL1Renderer

	constructor(
		{
			scene,
			camera,
			options,
			pixelRatio,
			outputEncoding,
			shadowMap,
			domElementId,
			width,
			height
		}: RendererControllerOptions,
		rendererType: RendererType
	) {
		this.scene = scene
		this.camera = camera
		this.width = width || 0
		this.height = height || 0

		switch (rendererType) {
			case RendererType.webGL:
				this.three = new WebGLRenderer(options)
				break
			case RendererType.webGL1:
				this.three = new WebGL1Renderer(options)
				break
			default:
				throw new Error(`Unknown rendererType of ${rendererType}`)
		}

		if (shadowMap) {
			this.shadowMap(shadowMap)
		}

		if (pixelRatio) {
			this.setPixelRatio(pixelRatio)
		}

		if (outputEncoding) {
			this.setOutputEncoding(outputEncoding)
		}

		this.attachToDOM(domElementId)

		this.render()

		addEventListener('resize', () => this.onWindowResize(domElementId), false)

		// save renderer to Svelte store
		renderer.set(this.three)
	}

	private attachToDOM(domElementId?: string): void {
		if (this.width && this.height) {
			this.three.setSize(this.width, this.height)
			this.camera.aspect = this.width / this.height
			this.camera.updateProjectionMatrix()

			return
		}

		if (domElementId) {
			const parentElement = document.getElementById(domElementId)

			if (!parentElement) {
				throw new Error(`Couldn't find element with id ${domElementId}`)
			} else {
				parentElement.appendChild(this.three.domElement)

				this.width = parentElement.offsetWidth
				this.height = parentElement.offsetHeight

				this.three.setSize(this.width, this.height)
				this.camera.aspect = this.width / this.height
				this.camera.updateProjectionMatrix()

				return
			}
		}
	}

	private render(): void {
		requestAnimationFrame(this.render.bind(this))

		this.three.render(this.scene, this.camera)
	}

	private onWindowResize(domElementId?: string): void {
		if (domElementId) {
			const parentElement = document.getElementById(domElementId)

			if (!parentElement) {
				throw new Error(`Couldn't find element with id ${domElementId}`)
			} else {
				parentElement.appendChild(this.three.domElement)

				this.width = parentElement.offsetWidth
				this.height = parentElement.offsetHeight

				this.three.setSize(this.width, this.height)
				this.camera.aspect = this.width / this.height
				this.camera.updateProjectionMatrix()
			}
		}
	}

	private shadowMap({ enabled, type }: RendererShadowMapOptions): void {
		this.three.shadowMap.enabled = enabled
		this.three.shadowMap.type = type
	}

	private setPixelRatio(ratio: number): void {
		this.three.setPixelRatio(ratio)
	}

	private setOutputEncoding(encoding: TextureEncoding): void {
		this.three.outputEncoding = encoding
	}
}
