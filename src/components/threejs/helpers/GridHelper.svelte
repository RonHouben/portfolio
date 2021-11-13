<script lang="ts">
	import {
		GridHelperController,
		GridHelperControllerOptions
	} from '../../../controllers/threejs/helpers/grid.helper.controller'
	import { scene } from '../../../stores/threejs/scene.store'

	export let size: GridHelperControllerOptions['size']
	export let divisions: GridHelperControllerOptions['divisions']

	new GridHelperController({
		scene: $scene,
		size,
		divisions
	})
</script>
