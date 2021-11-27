<script lang="ts">
	import {
		SpotLightAnimateFunction,
		SpotLightController,
		SpotLightControllerOptions
	} from '../../../controllers/threejs/lights/spot.light.controller'
	import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let options: Omit<SpotLightControllerOptions, 'scene'>
	export let animate: SpotLightAnimateFunction | undefined = undefined

	const lightController = new SpotLightController(options)

	if (animate) {
		animate(lightController.three, $sceneStore)
	}

	$: if (
		$loadingManagerStore &&
		(!$loadingManagerStore.isLoading || !$loadingManagerStore.hasError)
	) {
		lightController.update(options)
	}

	$: lightController.update(options)
</script>
