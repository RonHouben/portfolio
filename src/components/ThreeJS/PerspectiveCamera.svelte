<script lang="ts">
import { ThreeController } from '../../controllers/three.controller';
	import { PerspectiveCamera } from 'three'
	import { perspectiveCamera as camera } from '../../stores/threejs/perspective.camera.store'
	import type { AnimationProps, PositionProps } from './types'

	export const slot: string = 'camera'
	export let fov: number
	export let aspect: number
	export let near: number
	export let far: number
	export let position: PositionProps
	export let animate: AnimationProps = {}

	// set camera store state
	camera.set(new PerspectiveCamera(fov, aspect, near, far))

	const cameraController = new ThreeController($camera)

	// set camera position
	cameraController.position(position)

	// animation loop
	cameraController.animate(animate)

</script>
