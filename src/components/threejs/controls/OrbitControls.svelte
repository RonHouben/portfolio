<script lang="ts">
	import {
		OrbitControlsController,
		OrbitControlsControllerOptions
	} from '../../../controllers/threejs/controls/orbit.controls.controller'
	import { rendererStore } from '../../../stores/threejs/renderer.store'

	export let options: Omit<OrbitControlsControllerOptions, 'domElement'>

	$: if ($rendererStore && options) {
		const orbitControlsController = new OrbitControlsController({
			...options,
			domElement: $rendererStore.domElement
		})

		orbitControlsController.update(options)
	}
</script>
