<script lang="ts">
import type { ColorRepresentation } from "three";
import { DirectionalLightHelper } from "three";
import { DirectionalLight } from "three";
import { PositionOptions,ThreeController } from "../../../controllers/three.controller";
import { scene } from "../../../stores/threejs/scene.store";

	export let name: string = 'directional-light'
	export let color: ColorRepresentation | undefined = undefined
	export let intensity: number
	export let position: PositionOptions
	export let castShadow: boolean
	export let targetName: string = ''
	export let showHelper: boolean = false

	const light = new DirectionalLight(color, intensity)

	const target = $scene.getObjectByName(targetName)

	if (target) {
		light.target = target
	}

	if (showHelper){
		const helper = new DirectionalLightHelper(light, 2)
		$scene.add(helper)
	}

	$scene.add(light)

	// TODO: make a separate LightController
	const lightController = new ThreeController(light, name)

	lightController.position(position)
	lightController.setShadows({ castShadow })
</script>