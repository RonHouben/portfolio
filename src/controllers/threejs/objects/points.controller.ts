import { BufferGeometry, Material, Points, Vector3 } from 'three'
import type { AnimateFunction, BaseControllerOptions } from '../base.controller'
import { BaseController } from '../base.controller'

export interface PointsControllerOptions extends Omit<BaseControllerOptions, 'position'> {
	geometry: BufferGeometry
	material: Material
}

export type PointsInitOptions = Omit<PointsControllerOptions, 'position'>
export type PointsUpdateOptions = Omit<PointsControllerOptions, 'position'>

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
		this.createParticles(5800, 53)

		this.scene.add(this.three)
	}

	private createParticles(amount: number, distance: number): void {
		const particles: Vector3[] = []

		for (let i = 0; i < amount; i++) {
			const x = (Math.random() - 0.5) * distance
			const y = (Math.random() - 0.5) * distance
			const z = (Math.random() - 0.5) * distance

			const particle = new Vector3(x, y, z) 

			particles.push(particle) 
		}

		this.three.geometry.setFromPoints(particles)
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
}
