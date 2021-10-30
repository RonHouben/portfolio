<script lang="ts">
import { AnimationOptions, PositionOptions, ThreeController } from '../../controllers/three.controller';
	import { PerspectiveCamera } from 'three'
	import { perspectiveCamera as camera } from '../../stores/threejs/perspective.camera.store'
import { scene } from '../../stores/threejs/scene.store';

	export const slot: string = 'camera'
	export let fov: number
	export let aspect: number
	export let near: number
	export let far: number
	export let position: PositionOptions
	export let animate: AnimationOptions = {}

	// set camera store state
	camera.set(new PerspectiveCamera(fov, aspect, near, far))

	const cameraController = new ThreeController($camera)

	$scene.add($camera)

	// set camera position
	cameraController.position(position)

	// animation loop
	cameraController.animate(animate)

</script>
