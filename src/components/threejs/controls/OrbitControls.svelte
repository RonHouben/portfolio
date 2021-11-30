<script lang="ts">
	import { rendererStore } from '../../../stores/threejs/renderer.store';
	import {
		OrbitControlsController,
		OrbitControlsControllerOptions
	} from '../../../controllers/threejs/controls/orbit.controls.controller'

	export let options: Omit<OrbitControlsControllerOptions, 'domElement'>

	let orbitControlsController: OrbitControlsController

	$: if ($rendererStore) {
		orbitControlsController = new OrbitControlsController(options)
	}

	$: if (orbitControlsController) {
		orbitControlsController.update(options)
	}
</script>
