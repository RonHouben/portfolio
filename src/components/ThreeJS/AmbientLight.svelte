<script lang="ts">
	import { scene } from '../../stores/threejs/scene.store';
	import type { ColorRepresentation } from 'three';
	import { AmbientLight } from 'three';

	export let color: ColorRepresentation
	export let intensity: number | undefined = undefined

	const light = new AmbientLight(color, intensity)

	$scene.add(light)
</script>
