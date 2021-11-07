<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store';
	import type { ColorRepresentation } from 'three';
	import { HemisphereLight } from 'three';

	export let skyColor: ColorRepresentation | undefined = undefined
	export let groundColor: ColorRepresentation | undefined = undefined
	export let intensity: number | undefined = undefined

	const light = new HemisphereLight(skyColor, groundColor, intensity)

	$scene.add(light)
</script>
