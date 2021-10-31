<script lang="ts">
	import { AnimationOptions, PositionOptions, RotateOptions, ThreeController } from '../../../controllers/three.controller';
	import { PerspectiveCamera } from 'three'
	import { perspectiveCamera as camera } from '../../../stores/threejs/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store';

	export let name: string
	export let fov: number | undefined = undefined
	export let aspect: number | undefined = undefined
	export let near: number | undefined = undefined
	export let far: number | undefined = undefined
	export let position: PositionOptions
	export let animate: AnimationOptions = {}
	export let rotate: RotateOptions = {}

	// set camera store state
	camera.set(new PerspectiveCamera(fov, aspect, near, far))

	const cameraController = new ThreeController($camera, name)

	$scene.add($camera)

	// set camera position
	cameraController.position(position)
	cameraController.rotate(rotate)

	// animation loop
	cameraController.animate(animate)

</script>
