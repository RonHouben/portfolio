import { GridHelper } from 'three'
import { BaseHelperController } from './base.helper.controller'

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
