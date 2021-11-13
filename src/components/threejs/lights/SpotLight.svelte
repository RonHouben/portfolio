<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store'
	import type { PositionOptions } from '../../../controllers/threejs/base.controller'
	import {
		SpotLightController,
		SpotLightHelperOptions,
		SpotLightControllerOptions,
		SpotLightShadowOptions,
		SpotLightAnimateFunction
	} from '../../../controllers/threejs/lights/spot.light.controller'
	import { onMount } from 'svelte'

	export let options: Omit<SpotLightControllerOptions, 'scene'>
	export let shadow: SpotLightShadowOptions
	export let position: PositionOptions
	export let targetName = ''
	export let animate: SpotLightAnimateFunction | undefined = undefined
	export let helperOptions: Omit<SpotLightHelperOptions, 'scene'> = {
		light: { enabled: false },
		shadowCamera: { enabled: false }
	}

	const lightController = new SpotLightController({
		...options,
		scene: $scene
	})

	lightController.shadow(shadow)
	lightController.position(position)
	lightController.setHelpers(helperOptions)

	if (animate) {
		lightController.animate(animate)
	}

	$: if (options.color) {
		lightController.setColor(options.color)
	}

	onMount(() => {
		lightController.setTarget(targetName)
	})
</script>
