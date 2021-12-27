<script lang="ts" context="module">
  import type { AnimateFunction } from '$lib/controllers/threejs/base.controller.svelte'
  import {
    LightController,
    LightControllerOptions,
    LightInitOptions
  } from '$lib/controllers/threejs/lights/light.controller.svelte'
  import type { Color } from 'three'
  import { HemisphereLight } from 'three'

  export interface HemisphereLightControllerOptions
    extends Omit<LightControllerOptions<HemisphereLight>, 'shadow'> {
    skyColor?: Color
    groundColor?: Color
  }

  export interface HemisphereLightInitOptions extends LightInitOptions<HemisphereLight> {
    skyColor?: HemisphereLightControllerOptions['skyColor']
    groundColor?: HemisphereLightControllerOptions['groundColor']
  }

  export interface HemisphereLightUpdateOptions
    extends Omit<Omit<Omit<HemisphereLightControllerOptions, 'scene'>, 'position'>, 'rotation'> {
    skyColor?: HemisphereLightControllerOptions['skyColor']
    groundColor?: HemisphereLightControllerOptions['groundColor']
  }

  export class HemisphereLightController extends LightController<HemisphereLight> {
    public three: HemisphereLight
    protected interactable: HemisphereLight

    constructor(options: HemisphereLightControllerOptions) {
      const { skyColor, groundColor, intensity } = options
      super(options)

      this.three = new HemisphereLight(skyColor, groundColor, intensity)
      this.interactable = this.three

      this.init(options)

      this.scene.add(this.three)
    }

    protected init(options: HemisphereLightInitOptions): void {
      this.setColor(options.color)
      this.setGroundColor(options.groundColor)
      this.setIntensity(options.intensity)
    }

    public updateOptions(options: HemisphereLightUpdateOptions): void {
      this.setColor(options.color)
      this.setGroundColor(options.groundColor)
      this.setIntensity(options.intensity)
    }

    public override animate(animateFunction: AnimateFunction<HemisphereLight>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }

    private setGroundColor(groundColor: HemisphereLightControllerOptions['groundColor']): void {
      this.three.groundColor = groundColor || this.three.groundColor
    }
  }
</script>
