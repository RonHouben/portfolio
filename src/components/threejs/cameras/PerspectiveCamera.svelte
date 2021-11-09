<script lang="ts">
	import type {
		PositionOptions,
		RotateOptions,
	} from '../../../controllers/threejs/base.controller'
	import { camera } from '../../../stores/threejs/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store'
import { PerspectiveCameraAnimateFunction, PerspectiveCameraController } from '../../../controllers/threejs/cameras/perspective.camera';

	export let name: string
	export let fov: number | undefined = undefined
	export let aspect: number | undefined = undefined
	export let near: number | undefined = undefined
	export let far: number | undefined = undefined
	export let position: PositionOptions
	export let animate: PerspectiveCameraAnimateFunction = () => {}
	export let rotate: RotateOptions = {}
	export let lookAt : string = ''


	const cameraController = new PerspectiveCameraController({
		name,
		scene: $scene,
		fov,
		aspect,
		near,
		far
	})

	// set camera position
	cameraController.position(position)
	cameraController.rotate(rotate)
	cameraController.animate(animate)

	// set camera store state
	camera.set(cameraController.three)
</script>
