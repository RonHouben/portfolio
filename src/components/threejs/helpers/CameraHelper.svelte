<script lang="ts">
	import { CameraHelperController } from '../../../controllers/threejs/helpers/camera.helper.controller'
	import { cameraStore } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	$: if ($cameraStore && $sceneStore) {
		new CameraHelperController({
			scene: $sceneStore,
			camera: $cameraStore
		})
	}
</script>
