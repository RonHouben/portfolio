<script lang="ts">
	import { RaycasterController } from '../../controllers/threejs/raycaster.controller'
	import { raycaster } from '../../stores/threejs/raycaster.store'
	import { camera } from '../../stores/threejs/cameras/perspective.camera.store'
	import { scene } from '../../stores/threejs/scene.store'
	import { renderer } from '../../stores/threejs/renderer.store'

	$: if ($renderer) {
		raycaster.set(
			new RaycasterController({
				renderer: $renderer,
				scene: $scene,
				camera: $camera
			})
		)
	}
</script>
