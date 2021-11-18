<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		SpotLightController,
		SpotLightControllerOptions,
		SpotLightAnimateFunction
	} from '../../../controllers/threejs/lights/spot.light.controller'

	export let options: Omit<SpotLightControllerOptions, 'scene'>
	export let animate: SpotLightAnimateFunction | undefined = undefined

	const lightController = new SpotLightController(options)

	if (animate) {
		animate(lightController.three, $sceneStore)
	}

	$: lightController.update(options)
</script>
