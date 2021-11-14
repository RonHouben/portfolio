<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		AmbientLightController,
		AmbientLightControllerOptions
	} from '../../../controllers/threejs/lights/ambient.light.controller'

	export let options: Omit<AmbientLightControllerOptions, 'scene'>

	const ambientLightController = new AmbientLightController({ ...options, scene: $sceneStore })

	$: ambientLightController.update(options)
</script>
