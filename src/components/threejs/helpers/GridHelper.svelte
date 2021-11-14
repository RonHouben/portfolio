<script lang="ts">
	import {
		GridHelperController,
		GridHelperControllerOptions
	} from '../../../controllers/threejs/helpers/grid.helper.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let options: Omit<GridHelperControllerOptions, 'scene'>

	new GridHelperController({
		scene: $sceneStore,
		size: options.size,
		divisions: options.divisions
	})
</script>
