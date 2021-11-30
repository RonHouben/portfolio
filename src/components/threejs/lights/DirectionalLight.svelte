<script lang="ts">
import { onMount } from 'svelte';

	import {
		DirectionalLightController,
		DirectionalLightControllerOptions
	} from '../../../controllers/threejs/lights/directional.light.controller'

	export let options: DirectionalLightControllerOptions

	let directionalLightController: DirectionalLightController | undefined

	onMount(() => {
		directionalLightController = new DirectionalLightController(options)
	})

	$: if (directionalLightController) {
		directionalLightController.update(options)
	}
</script>
