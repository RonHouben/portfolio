<script lang="ts">
	import { renderer } from '../../../stores/threejs/renderer.store'
	import {
		OrbitControlsController,
		OrbitControlsControllerOptions
	} from '../../../controllers/threejs/controls/orbit.controls.controller'
	import { camera } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store'

	export let options: OrbitControlsOptions

	type OrbitControlsOptions = Omit<
		Omit<Omit<OrbitControlsControllerOptions, 'scene'>, 'camera'>,
		'domElement'
	>

	$: if ($renderer && $scene && $camera) {
		new OrbitControlsController({
			...options,
			camera: $camera,
			scene: $scene,
			domElement: $renderer.domElement
		})
	}
</script>
