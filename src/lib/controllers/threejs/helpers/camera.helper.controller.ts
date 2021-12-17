import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller'
import { Camera, CameraHelper } from 'three'

export class CameraHelperController extends BaseHelperController<CameraHelper> {
  constructor(camera: Camera) {
    super()

    const helper = new CameraHelper(camera)

    this.scene.add(helper)
  }
}
