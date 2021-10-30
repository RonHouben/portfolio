import type { AnimationProps, PositionProps } from 'src/components/ThreeJS/types'
import type { Object3D } from 'three'

export class ThreeController {
	private obj: Object3D

	constructor(obj: Object3D) {
		this.obj = obj
	}

	public position(options: PositionProps): void {
		this.obj.position.x = options.x || this.obj.position.x
		this.obj.position.y = options.y || this.obj.position.y
		this.obj.position.z = options.z || this.obj.position.z
	}

	public animate(options: AnimationProps): void {
		requestAnimationFrame(() => this.animate(options))

		this.obj.rotateX(options.rotateX || 0)
		this.obj.rotateY(options.rotateY || 0)
		this.obj.rotateZ(options.rotateY || 0)

		const reachedTranslateXLimit =
			options.translateX?.limit && this.obj.position.x >= options.translateX?.limit

		const reachedTranslateYLimit =
			options.translateY?.limit && this.obj.position.y >= options.translateY?.limit

		const reachedTranslateZLimit =
			options.translateZ?.limit && this.obj.position.z >= options.translateZ?.limit

		if (!reachedTranslateXLimit) {
			this.obj.translateX(options.translateX?.distance || 0)
		}
		
		if (!reachedTranslateYLimit) {
			this.obj.translateY(options.translateY?.distance || 0)
		}

		if (!reachedTranslateZLimit) {
			this.obj.translateZ(options.translateZ?.distance || 0)
		}
	}
}
