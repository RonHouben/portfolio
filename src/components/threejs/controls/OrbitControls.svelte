<script lang="ts">
	import {
		OrbitControlsController,
		OrbitControlsControllerOptions
	} from '../../../controllers/threejs/controls/orbit.controls.controller'
	import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'
	import { rendererStore } from '../../../stores/threejs/renderer.store'

	export let options: Omit<OrbitControlsControllerOptions, 'domElement'>

	$: if ($rendererStore && !$loadingManagerStore.isLoading && options) {
		const orbitControlsController = new OrbitControlsController({
			...options,
			domElement: $rendererStore.domElement
		})

		orbitControlsController.update(options)
	}
</script>
