import { BaseHelperController } from '$lib/controllers/threejs/helpers/base.helper.controller'
import { GridHelper } from 'three'

export interface GridHelperControllerOptions {
  size: number
  divisions: number
}

export class GridHelperController extends BaseHelperController<GridHelper> {
  constructor({ size, divisions }: GridHelperControllerOptions) {
    super()

    this.three = new GridHelper(size, divisions)

    this.scene.add(this.three)
  }
}
