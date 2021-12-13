import { BufferGeometry, Material, Points, Vector3 } from 'three'
import type { AnimateFunction, BaseControllerOptions } from '../base.controller'
import { BaseController } from '../base.controller'

export interface PointsControllerOptions extends Omit<BaseControllerOptions, 'position'> {
  geometry: BufferGeometry
  material: Material
}

export type PointsInitOptions = Omit<PointsControllerOptions, 'position'>
export type PointsUpdateOptions = Omit<PointsControllerOptions, 'position'>
export type CreatePointsFunction = () => Vector3[]

export class PointsController extends BaseController<Points> {
  public three: Points

  constructor(options: PointsControllerOptions) {
    const { geometry, material } = options
    super(options)

    this.three = new Points(geometry, material)
    this.init(options)
    this.update(options)
  }

  protected override init(options: PointsInitOptions): void {
    this.three.name = options.name
    this.setShadow(options.shadow)

    this.scene.add(this.three)
  }

  public override update(options: PointsUpdateOptions): void {
    this.three.name = options.name
    this.three.geometry = options.geometry
    this.three.material = options.material
  }

  public override animate(animateFunction: AnimateFunction<Points>): void {
    requestAnimationFrame(() => this.animate(animateFunction))

    animateFunction(this.three, this.scene)
  }

  public createPoints(createPointsFunction: CreatePointsFunction): void {
    const points: Vector3[] = createPointsFunction()

    this.three.geometry.setFromPoints(points)
  }
}
