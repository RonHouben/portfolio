import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller'
import { AxesHelper } from 'three'

export interface AxesHelperControllerOptions {
  size: number
}

export class AxesHelperController extends BaseHelperController<AxesHelper> {
  constructor({ size }: AxesHelperControllerOptions) {
    super()

    this.three = new AxesHelper(size)

    this.scene.add(this.three)
  }
}
