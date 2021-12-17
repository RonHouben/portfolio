<script lang="ts" context="module">
  import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller.svelte'
  import { AxesHelper } from 'three'

  export interface AxesHelperControllerOptions {
    size: number
  }

  export class AxesHelperController extends BaseHelperController<AxesHelper> {
    constructor({ size }: AxesHelperControllerOptions) {
      super()

      this.three = new AxesHelper(size)

      this.scene.add(this.three)

      console.info('enabled axes helper:')
      console.info({ x: 'red', y: 'green', z: 'blue' })
    }
  }
</script>
