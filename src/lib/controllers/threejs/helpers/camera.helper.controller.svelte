<script lang="ts" context="module">
  import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller.svelte'
  import type { Scene } from 'three'
  import { Camera, CameraHelper } from 'three'

  export class CameraHelperController extends BaseHelperController<CameraHelper> {
    constructor(scene: Scene, camera: Camera) {
      super()

      const helper = new CameraHelper(camera)

      scene.add(helper)
    }
  }
</script>
