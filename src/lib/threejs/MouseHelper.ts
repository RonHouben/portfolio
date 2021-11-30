import { cameraStore } from '../../stores/threejs/cameras/perspective.camera.store'
import { get } from 'svelte/store'
import { Object3D, Vector3 } from 'three'
import type { AnimeParams } from 'animejs'
import anime from 'animejs'
import { rendererStore } from '../../stores/threejs/renderer.store'

export class MouseHelper {
	private clientX!: number
	private clientY!: number
	
	constructor() {
		addEventListener('mousemove', ({ clientX, clientY }) => {
			this.clientX = clientX
			this.clientY = clientY
		})
	}
	public getMousePositionInCanvas(): { x: number; y: number } {
		const canvas = get(rendererStore).domElement
		const canvasRect = canvas.getBoundingClientRect()

		return {
			x: (this.clientX / canvasRect.width) * 2 - 1,
			y: -(this.clientY / canvasRect.height) * 2 + 1
		}
	}

	public static followMouse(
		mouseX: number,
		mouseY: number,
		object: Object3D,
		animeOptions?: Omit<AnimeParams, 'targets'>
	): void {
		const camera = get(cameraStore)
		// Make the sphere follow the mouse
		const vector = new Vector3(mouseX, mouseY, object.position.y)

		vector.unproject(camera)

		const direction = vector.sub(camera.position).normalize()
		const distance = -camera.position.z / direction.z
		const newPosition = camera.position.clone().add(direction.multiplyScalar(distance))

		if (!animeOptions) {
			object.position.copy(newPosition)
		} else {
			anime({
				...animeOptions,
				targets: [object.position, object.rotation],
				x: newPosition.x,
				y: newPosition.y
			})
		}
	}
}
