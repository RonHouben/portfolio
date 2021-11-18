<script lang="ts">
	import {
		DirectionalLightController,
		DirectionalLightControllerOptions,
	} from '../../../controllers/threejs/lights/directional.light.controller'

	export let options: DirectionalLightControllerOptions

	const directionalLightController = new DirectionalLightController(options)

	$: directionalLightController.update(options)
</script>
