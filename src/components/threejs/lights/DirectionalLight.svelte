<script lang="ts">
import type { ColorRepresentation } from "three";
import { DirectionalLight } from "three";
import { PositionOptions,RotateOptions,ThreeController } from "../../../controllers/three.controller";
import { scene } from "../../../stores/threejs/scene.store";

	export let name: string
	export let color: ColorRepresentation | undefined = undefined
	export let intensity: number
	export let position: PositionOptions
	export let rotate: RotateOptions = {}
	export let castShadow: boolean
	export let targetName: string = ''

	const light = new DirectionalLight(color, intensity)

	const target = $scene.getObjectByName(targetName)

	if (target) {
		light.target = target
	}

	$scene.add(light)

	// TODO: make a separate LightController
	const lightController = new ThreeController(light, name)

	lightController.position(position)
	lightController.rotate(rotate)
	lightController.setShadows({ castShadow })
</script>