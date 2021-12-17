<script lang="ts" context="module">
  import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller.svelte'
  import { Camera, CameraHelper } from 'three'

  export class CameraHelperController extends BaseHelperController<CameraHelper> {
    constructor(camera: Camera) {
      super()

      const helper = new CameraHelper(camera)

      this.scene.add(helper)
    }
  }
</script>
