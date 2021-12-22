<script lang="ts" context="module">
  import type { AnimateFunction } from '$lib/controllers/threejs/base.controller.svelte'
  import type {
    LightControllerOptions,
    LightInitOptions
  } from '$lib/controllers/threejs/lights/light.controller.svelte'
  import { LightController } from '$lib/controllers/threejs/lights/light.controller.svelte'
  import { AmbientLight } from 'three'

  export type AmbientLightControllerOptions = Omit<
    Omit<Omit<LightControllerOptions<AmbientLight>, 'position'>, 'rotation'>,
    'shadow'
  >
  export type AmbientLightInitOptions = Omit<
    Omit<LightInitOptions<AmbientLight>, 'position'>,
    'rotation'
  >
  export type AmbientLightUpdateOptions = Omit<
    Omit<AmbientLightControllerOptions, 'position'>,
    'rotation'
  >

  export class AmbientLightController extends LightController<AmbientLight> {
    constructor(options: AmbientLightControllerOptions) {
      super(options)
      this.three = new AmbientLight(options.color, options.intensity)

      this.init(options)

      this.scene.add(this.three)
    }

    protected override init(options: AmbientLightInitOptions): void {
      this.three.name = options.name

      this.setColor(options.color)
      this.setShadow(options.shadow)
    }

    public override update(options: Omit<AmbientLightControllerOptions, 'scene'>): void {
      this.setColor(options.color)
    }

    public override animate(animateFunction: AnimateFunction<AmbientLight>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }
  }
</script>
