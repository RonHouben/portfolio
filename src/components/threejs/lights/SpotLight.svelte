<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		SpotLightController,
		SpotLightControllerOptions,
		SpotLightAnimateFunction
	} from '../../../controllers/threejs/lights/spot.light.controller'

	type SpotLightOptions = Omit<SpotLightControllerOptions, 'scene'>

	export let options: SpotLightOptions
	export let animate: SpotLightAnimateFunction | undefined = undefined

	const lightController = new SpotLightController({
		...options,
		scene: $sceneStore
	})

	if (animate) {
		animate(lightController.three)
	}

	$: lightController.update(options)
</script>
