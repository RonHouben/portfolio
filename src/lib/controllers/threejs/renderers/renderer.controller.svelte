<script lang="ts" context="module">
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { RendererType } from '$lib/utils/types'
  import { get } from 'svelte/store'
  import type { TextureEncoding,WebGLRendererParameters,WebGLShadowMap } from 'three'
  import { WebGL1Renderer,WebGLRenderer } from 'three'

  export interface RendererControllerOptions extends WebGLRendererParameters {
    domElementId: string
    width?: number
    height?: number
    shadowMap?: RendererShadowMapOptions
    outputEncoding?: TextureEncoding
    pixelRatio?: number
  }

  type RendererShadowMapOptions = Pick<WebGLShadowMap, 'enabled'> & Pick<WebGLShadowMap, 'type'>

  export class RendererController {
    private width: RendererControllerOptions['width']
    private height: RendererControllerOptions['height']
    public three: WebGLRenderer | WebGL1Renderer

    constructor(options: RendererControllerOptions, rendererType: RendererType) {
      const { width, height, domElementId } = options

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

      this.attachToDOM(domElementId)
      this.addEventListeners(domElementId)
      // set Svelte store
      rendererStore.set(this.three)

      this.renderLoop(options)
    }

    private addEventListeners(domElementId: RendererControllerOptions['domElementId']): void {
      addEventListener('resize', () => this.onWindowResize(domElementId), false)
    }

    private attachToDOM(domElementId: RendererControllerOptions['domElementId']): void {
      if (this.width && this.height) {
        this.three.setSize(this.width, this.height)

        return
      } else {
        const parentElement = document.getElementById(domElementId)

        if (!parentElement) {
          throw new Error(`Couldn't find element with id ${domElementId}`)
        } else {
          parentElement.appendChild(this.three.domElement)

          this.width = parentElement.offsetWidth
          this.height = parentElement.offsetHeight

          this.three.setSize(this.width, this.height)

          return
        }
      }
    }

    private renderLoop(options: RendererControllerOptions): void {
      requestAnimationFrame(() => this.renderLoop(options))

      this.update(options)

      const scene = get(sceneStore)
      const camera = get(cameraStore)

      if (scene && camera) {
        this.three.render(scene, camera)
      }
    }

    private update(options: RendererControllerOptions): void {
      this.shadowMap(options.shadowMap)
      this.setPixelRatio(options.pixelRatio)
      this.setOutputEncoding(options.outputEncoding)

      // update Svelte store
      rendererStore.update(() => this.three)
    }

    private onWindowResize(domElementId: RendererControllerOptions['domElementId']): void {
      const parentElement = document.getElementById(domElementId)

      if (!parentElement) {
        throw new Error(`Couldn't find element with id ${domElementId}`)
      } else {
        this.width = parentElement.offsetWidth
        this.height = parentElement.offsetHeight

        this.three.setSize(this.width, this.height)

        // this.setCamera()
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
  }
</script>
