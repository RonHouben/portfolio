<script lang="ts" context="module">
  import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller.svelte'
  import type { Scene } from 'three'
  import { GridHelper } from 'three'

  export interface GridHelperControllerOptions {
    size: number
    divisions: number
  }

  export class GridHelperController extends BaseHelperController<GridHelper> {
    constructor(scene: Scene, { size, divisions }: GridHelperControllerOptions) {
      super()

      this.helper = new GridHelper(size, divisions)

      scene.add(this.helper)
    }
  }
</script>
