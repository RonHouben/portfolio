<script lang="ts">
	import type { PositionOptions } from '../../../controllers/threejs/base.controller'
	import type { LightShadowOptions } from '../../../controllers/threejs/lights/light.controller'
	import { scene } from '../../../stores/threejs/scene.store'
	import {
		DirectionalLightController,
		DirectionalLightControllerOptions,
		DirectionalLightHelperOptions
	} from '../../../controllers/threejs/lights/directional.light.controller'

	export let options: Omit<DirectionalLightControllerOptions, 'scene'>
	export let helperOptions: DirectionalLightHelperOptions = {}
	export let position: PositionOptions
	export let shadow: LightShadowOptions
	export let targetName = ''

	const lightController = new DirectionalLightController({
		name: options.name,
		scene: $scene
	})

	const light = lightController.three

	light.shadow.camera.visible = true
	const d = 10

	light.shadow.camera.left = -d
	light.shadow.camera.right = d
	light.shadow.camera.top = d
	light.shadow.camera.bottom = -d
	light.shadow.camera.far = 1000

	lightController.position(position)
	lightController.shadow(shadow)
	lightController.setHelpers(helperOptions)

	lightController.animate({ targetName })
</script>
