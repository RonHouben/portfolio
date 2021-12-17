import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller'
import { AxesHelper } from 'three'

export class AxesHelperController extends BaseHelperController<AxesHelper> {
  constructor(size: number) {
    super()

    this.three = new AxesHelper(size)

    this.scene.add(this.three)

    console.info('enabled axes helper:', { x: 'red', y: 'green', z: 'blue' })
  }
}
