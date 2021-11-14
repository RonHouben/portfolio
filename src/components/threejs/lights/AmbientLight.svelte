<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		AmbientLightController,
		AmbientLightControllerOptions
	} from '../../../controllers/threejs/lights/ambient.light.controller'

	type AmbientLightOptions = Omit<AmbientLightControllerOptions, 'scene'>

	export let options: AmbientLightOptions

	const ambientLightController = new AmbientLightController({ ...options, scene: $sceneStore })

	$: ambientLightController.update(options)
</script>
