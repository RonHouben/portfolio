<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		PerspectiveCameraAnimateFunction,
		PerspectiveCameraController,
		PerspectiveCameraControllerOptions
	} from '../../../controllers/threejs/cameras/perspective.camera'

	type PerspectiveCameraOptions = Omit<PerspectiveCameraControllerOptions, 'scene'>

	export let options: PerspectiveCameraOptions
	export let animate: PerspectiveCameraAnimateFunction | undefined = undefined

	const cameraController = new PerspectiveCameraController({
		...options,
		scene: $sceneStore
	})

	if (animate) {
		animate(cameraController.three)
	}

	$: cameraController.update(options)
</script>
