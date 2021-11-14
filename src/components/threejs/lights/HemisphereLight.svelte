<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import type { HemisphereLightControllerOptions } from '../../../controllers/threejs/lights/hemisphere.light.controller'
	import { HemisphereLightController } from 'src/controllers/threejs/lights/hemisphere.light.controller';

	type HemisphereLightOptions = Omit<HemisphereLightControllerOptions, 'scene'>
	export let options: HemisphereLightOptions

	const lightController = new HemisphereLightController({ ...options, scene: $sceneStore })

	$: lightController.update(options)
</script>
