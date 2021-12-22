<script lang="ts" context="module">
  import {
    StatsControllerOptions,
    StatsHelperController
  } from '$lib/controllers/statsjs/stats.controller.svelte'
  import type {
    AnimateFunction,
    BaseControllerOptions
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { Color, Fog, Material, Renderer, Texture } from 'three'
  import { Scene } from 'three'
  import {
    AxesHelperController,
    AxesHelperControllerOptions
  } from '../helpers/axes.helper.controller.svelte'
  import {
    GridHelperController,
    GridHelperControllerOptions
  } from '../helpers/grid.helper.controller.svelte'

  type HelperOptions<T> = T & {
    enabled: boolean
  }
  export interface SceneControllerOptions extends Pick<BaseControllerOptions<Scene>, 'name'> {
    autoUpdate?: boolean
    background?: Color | Texture
    environment?: Texture
    fog?: Fog
    overrideMaterial?: Material
    helpers?: {
      axes?: HelperOptions<AxesHelperControllerOptions>
      grid?: HelperOptions<GridHelperControllerOptions>
      stats?: HelperOptions<Omit<StatsControllerOptions, 'domElement'>>
    }
  }

  export class SceneController extends BaseController<Scene> {
    private renderer: Renderer

    constructor(renderer: Renderer, options: SceneControllerOptions) {
      super(options)

      this.renderer = renderer

      this.init(options)

      // set Svelte store
      sceneStore.set(this.three)
    }

    protected override init(options: SceneControllerOptions): void {
      this.scene = new Scene()
      this.three = this.scene
      this.three.name = options.name
      this.setAutoUpdate(options.autoUpdate)
      this.setBackground(options.background)
      this.setEnvironment(options.environment)
      this.setFog(options.fog)
      this.setOverrideMaterial(options.overrideMaterial)
      this.enableHelpers(options.helpers)
    }

    private enableHelpers(options: SceneControllerOptions['helpers']): void {
      if (options?.axes?.enabled) {
        new AxesHelperController(this.scene, options.axes)
      }

      if (options?.grid?.enabled) {
        new GridHelperController(this.scene, options.grid)
      }

      if (options?.stats?.enabled) {
        if (!this.renderer.domElement) {
          throw new Error(`Unable to find ThreeJS renderer's parentElement`)
        }

        new StatsHelperController(this.renderer, options.stats)
      }
    }

    public override update(options: SceneControllerOptions): void {
      this.setAutoUpdate(options.autoUpdate)
      this.setBackground(options.background)
      this.setEnvironment(options.environment)
      this.setFog(options.fog)
      this.setOverrideMaterial(options.overrideMaterial)

      // update Svelte store
      sceneStore.update(() => this.three)
    }

    public override animate(animateFunction: AnimateFunction<Scene>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }

    private setAutoUpdate(autoUpdate: SceneControllerOptions['autoUpdate']): void {
      this.three.autoUpdate = autoUpdate || this.three.autoUpdate
    }

    private setBackground(background: SceneControllerOptions['background']): void {
      this.three.background = background || this.three.background
    }

    private setEnvironment(environment: SceneControllerOptions['environment']): void {
      this.three.environment = environment || this.three.environment
    }

    private setFog(fog: SceneControllerOptions['fog']): void {
      this.three.fog = fog || this.three.fog
    }

    private setOverrideMaterial(
      overrideMaterial: SceneControllerOptions['overrideMaterial']
    ): void {
      this.three.overrideMaterial = overrideMaterial || this.three.overrideMaterial
    }
  }
</script>
