import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store'
import { rendererStore } from '$lib/stores/threejs/renderer.store'
import { sceneStore } from '$lib/stores/threejs/scene.store'
import { get } from 'svelte/store'
import type {
  Camera,
  PerspectiveCamera,
  Scene,
  TextureEncoding,
  WebGLRendererParameters,
  WebGLShadowMap
} from 'three'
import { WebGL1Renderer, WebGLRenderer } from 'three'
import { AxesHelperController } from '../helpers/axes.helper.controller'

export interface RendererControllerOptions extends WebGLRendererParameters {
  domElementId: string
  width?: number
  height?: number
  shadowMap?: RendererShadowMapOptions
  outputEncoding?: TextureEncoding
  pixelRatio?: number
  helpers?: {
    axes?: {
      enabled: boolean
      size: number
    }
  }
}

type RendererShadowMapOptions = Pick<WebGLShadowMap, 'enabled'> & Pick<WebGLShadowMap, 'type'>

export enum RendererType {
  webGL,
  webGL1
}

export class RendererController {
  private scene: Scene
  private camera: Camera
  private width: RendererControllerOptions['width']
  private height: RendererControllerOptions['height']
  public three: WebGLRenderer | WebGL1Renderer

  constructor(options: RendererControllerOptions, rendererType: RendererType) {
    const { width, height, domElementId } = options

    this.scene = get(sceneStore)
    this.camera = get(cameraStore)
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

    addEventListener('resize', () => this.onWindowResize(domElementId), false)

    this.enableHelpers(options.helpers)
    this.update(options)
    this.attachToDOM(domElementId)
    this.render()

    // set Svelte store
    rendererStore.set(this.three)
  }

  private enableHelpers(options: RendererControllerOptions['helpers']): void {
    if (options?.axes?.enabled) {
      new AxesHelperController(options.axes.size)
    }
  }

  private attachToDOM(domElementId?: string): void {
    if (this.width && this.height) {
      this.three.setSize(this.width, this.height)

      if (this.camera.type === 'PerspectiveCamera') {
        this.setPerspectiveCamera()
      }

      return
    }

    if (document && domElementId) {
      const parentElement = document.getElementById(domElementId)

      if (!parentElement) {
        throw new Error(`Couldn't find element with id ${domElementId}`)
      } else {
        parentElement.appendChild(this.three.domElement)

        this.width = parentElement.offsetWidth
        this.height = parentElement.offsetHeight

        this.three.setSize(this.width, this.height)

        if (this.camera.type === 'PerspectiveCamera') {
          this.setPerspectiveCamera()
        }

        return
      }
    }
  }

  public update(options: RendererControllerOptions): void {
    this.shadowMap(options.shadowMap)
    this.setPixelRatio(options.pixelRatio)
    this.setOutputEncoding(options.outputEncoding)

    // update Svelte store
    rendererStore.update(() => this.three)
  }

  private render(): void {
    requestAnimationFrame(this.render.bind(this))

    this.three.render(this.scene, this.camera)
  }

  private onWindowResize(domElementId?: string): void {
    if (document && domElementId) {
      const parentElement = document.getElementById(domElementId)

      if (!parentElement) {
        throw new Error(`Couldn't find element with id ${domElementId}`)
      } else {
        parentElement.appendChild(this.three.domElement)

        this.width = parentElement.offsetWidth
        this.height = parentElement.offsetHeight

        this.three.setSize(this.width, this.height)

        if (this.camera.type === 'PerspectiveCamera') {
          this.setPerspectiveCamera()
        }
      }
    }
  }

  private shadowMap(options: RendererControllerOptions['shadowMap']): void {
    this.three.shadowMap.enabled = options?.enabled || this.three.shadowMap.enabled
    this.three.shadowMap.type = options?.type || this.three.shadowMap.type
  }

  private setPixelRatio(ratio: RendererControllerOptions['pixelRatio']): void {
    this.three.pixelRatio = ratio || this.three.pixelRatio
  }

  private setOutputEncoding(encoding: RendererControllerOptions['outputEncoding']): void {
    this.three.outputEncoding = encoding || this.three.outputEncoding
  }

  private setPerspectiveCamera(): void {
    const camera = this.camera as PerspectiveCamera

    camera.aspect = (this.width || 0) / (this.height || 0)
    camera.updateProjectionMatrix()
  }
}
