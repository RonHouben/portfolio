<script lang="ts">
	import { RaycasterController } from '../../controllers/threejs/raycaster.controller'
	import { cameraStore } from '../../stores/threejs/cameras/perspective.camera.store'
	import { sceneStore } from '../../stores/threejs/scene.store'
	import { rendererStore } from '../../stores/threejs/renderer.store'

	$: if ($rendererStore && $sceneStore && $cameraStore) {
		new RaycasterController({
			renderer: $rendererStore,
			scene: $sceneStore,
			camera: $cameraStore
		})
	}
</script>
