<script lang="ts">
	import { rendererStore } from '../../../stores/threejs/renderer.store'
	import {
		OrbitControlsController,
		OrbitControlsControllerOptions
	} from '../../../controllers/threejs/controls/orbit.controls.controller'
	import { cameraStore } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let options: OrbitControlsOptions

	type OrbitControlsOptions = Omit<
		Omit<Omit<OrbitControlsControllerOptions, 'scene'>, 'camera'>,
		'domElement'
	>

	$: if ($rendererStore && $sceneStore && $cameraStore) {
		new OrbitControlsController({
			...options,
			camera: $cameraStore,
			scene: $sceneStore,
			domElement: $rendererStore.domElement
		})
	}
</script>
