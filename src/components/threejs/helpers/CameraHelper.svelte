<script lang="ts">
	import { CameraHelperController } from '../../../controllers/threejs/helpers/camera.helper.controller'
	import { camera } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store'

	$: if ($camera) {
		new CameraHelperController({
			scene: $scene,
			camera: $camera
		})
	}
</script>
