<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import {
		DirectionalLightController,
		DirectionalLightControllerOptions,
	} from '../../../controllers/threejs/lights/directional.light.controller'

	export let options: Omit<DirectionalLightControllerOptions, 'scene'>

	new DirectionalLightController({
		...options,
		scene: $sceneStore
	})
</script>
