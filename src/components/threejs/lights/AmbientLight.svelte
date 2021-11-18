<script lang="ts">
	import {
		AmbientLightController,
		AmbientLightControllerOptions
	} from '../../../controllers/threejs/lights/ambient.light.controller'

	export let options: AmbientLightControllerOptions

	const ambientLightController = new AmbientLightController(options)

	$: ambientLightController.update(options)
</script>
