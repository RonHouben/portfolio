<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store';
	import type { ColorRepresentation } from 'three';
	import { AmbientLight } from 'three';

	export let color: ColorRepresentation | undefined = undefined
	export let intensity: number | undefined = undefined

	// TODO: create separate controller
	const light = new AmbientLight(color, intensity)

	light.castShadow = false;

	$scene.add(light)
</script>
