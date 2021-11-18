<script lang="ts">
	import type { HemisphereLightControllerOptions } from '../../../controllers/threejs/lights/hemisphere.light.controller'
	import { HemisphereLightController } from 'src/controllers/threejs/lights/hemisphere.light.controller'

	export let options: HemisphereLightControllerOptions

	const lightController = new HemisphereLightController(options)

	$: lightController.update(options)
</script>
