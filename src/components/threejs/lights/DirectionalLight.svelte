<script lang="ts">
import type { ColorRepresentation,Object3D } from "three";
import { DirectionalLightHelper } from "three";
import { DirectionalLight } from "three";
import { PositionOptions,ThreeController } from "../../../controllers/three.controller";
import { scene } from "../../../stores/threejs/scene.store";

	export let name: string = 'directional-light'
	export let color: ColorRepresentation
	export let intensity: number
	export let position: PositionOptions
	export let targetName: string = ''
	export let showHelper: boolean = false

	const light = new DirectionalLight(color, intensity)
	light.castShadow = true

	const target = $scene.getObjectByName(targetName)

	if (target) {
		light.target = target
	}

	if (showHelper){
		const helper = new DirectionalLightHelper(light, 2)
		$scene.add(helper)
	}

	$scene.add(light)

	const lightController = new ThreeController(light, name)

	lightController.position(position)
</script>