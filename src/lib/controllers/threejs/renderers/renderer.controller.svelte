<script lang="ts" context="module">
import { browser } from '$app/env';

  import type { StatsControllerOptions } from '$lib/controllers/statsjs/stats.controller.svelte'
  import { StatsController } from '$lib/controllers/statsjs/stats.controller.svelte'
  import type { AxesHelperControllerOptions } from '$lib/controllers/threejs/helpers/axes.helper.controller.svelte'
  import { AxesHelperController } from '$lib/controllers/threejs/helpers/axes.helper.controller.svelte'
  import type { GridHelperControllerOptions } from '$lib/controllers/threejs/helpers/grid.helper.controller.svelte'
  import { GridHelperController } from '$lib/controllers/threejs/helpers/grid.helper.controller.svelte'
  import { cameraStore } from '$lib/stores/threejs/cameras/perspective.camera.store.svelte'
  import { rendererStore } from '$lib/stores/threejs/renderer.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
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

  type HelperOptions<T> = T & {
    enabled: boolean
  }

  export interface RendererControllerOptions extends WebGLRendererParameters {
    domElementId: string
    width?: number
    height?: number
    shadowMap?: RendererShadowMapOptions
    outputEncoding?: TextureEncoding
    pixelRatio?: number
    helpers?: {
      axes?: HelperOptions<AxesHelperControllerOptions>
      grid?: HelperOptions<GridHelperControllerOptions>
      stats?: HelperOptions<Omit<StatsControllerOptions, 'domElement'>>
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

      this.attachToDOM(domElementId)
      this.renderLoop()

      // set Svelte store
      rendererStore.set(this.three)

      this.enableHelpers(options.helpers)
      addEventListener('resize', () => this.onWindowResize(domElementId), false)

      this.update(options)
    }

    private enableHelpers(options: RendererControllerOptions['helpers']): void {
      if (options?.axes?.enabled) {
        new AxesHelperController(options.axes)
      }

      if (options?.grid?.enabled) {
        new GridHelperController(options.grid)
      }

      if (options?.stats?.enabled) {
        if (!this.three.domElement) {
          throw new Error(`Unable to find ThreeJS renderer's parentElement`)
        }

        new StatsController({ domElement: this.three.domElement, ...options.stats })
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

      if (this.camera && domElementId) {
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

    private renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      this.scene = get(sceneStore)
      this.camera = get(cameraStore)

      if (this.scene && this.camera) {
        this.three.render(this.scene, this.camera)
      }
    }

    private onWindowResize(domElementId?: string): void {
      if (this.camera && domElementId) {
        const parentElement = document.getElementById(domElementId)

        if (!parentElement) {
          throw new Error(`Couldn't find element with id ${domElementId}`)
        } else {
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
</script>
