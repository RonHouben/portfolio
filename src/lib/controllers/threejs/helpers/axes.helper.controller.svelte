<script lang="ts" context="module">
  import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller.svelte'
  import type { Scene } from 'three'
  import { AxesHelper } from 'three'

  export interface AxesHelperControllerOptions {
    size: number
  }

  export class AxesHelperController extends BaseHelperController<AxesHelper> {
    constructor(scene: Scene, { size }: AxesHelperControllerOptions) {
      super()

      this.helper = new AxesHelper(size)

      scene.add(this.helper)

      console.info('enabled axes helper:')
      console.info({ x: 'red', y: 'green', z: 'blue' })
    }
  }
</script>
