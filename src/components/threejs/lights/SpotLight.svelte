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

	export let options: Omit<SpotLightControllerOptions, 'scene'>
	export let shadow: SpotLightShadowOptions
	export let position: PositionOptions
	export let lookAt: string = ''
	export let animate: SpotLightAnimateFunction = () => {}
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
	lightController.animate(animate)

	// onMount(() => {
	// TODO: find a way to implement target
	// const target = $scene.getObjectByName(lookAt)

	// if (target) {
	// lightController.animate({ ...animate, target: target })
	// } else {
	// lightController.animate(animate)
	// }
	// })
</script>
