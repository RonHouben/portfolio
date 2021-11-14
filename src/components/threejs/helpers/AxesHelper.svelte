<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import { AxesHelperController, AxesHelperControllerOptions } from 'src/controllers/threejs/helpers/axes.helper.controller';

	export let options: AxesHelperControllerOptions

	new AxesHelperController({
		...options,
		scene: $sceneStore,
	})

	console.log({ x: 'red', y: 'green', z: 'blue' })
</script>
