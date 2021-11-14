<script lang="ts">
	import {
		GridHelperController,
		GridHelperControllerOptions
	} from '../../../controllers/threejs/helpers/grid.helper.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let size: GridHelperControllerOptions['size']
	export let divisions: GridHelperControllerOptions['divisions']

	new GridHelperController({
		scene: $sceneStore,
		size,
		divisions
	})
</script>
