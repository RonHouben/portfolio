<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store'
	import { renderer } from '../../../stores/threejs/renderer.store'
	import {
		OrbitControlsAnimationOptions,
		OrbitControlsController,
		OrbitControlsDampingOptions,
	} from '../../../controllers/threejs/controls/orbit.controls.controller'
	import { camera } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { onMount } from 'svelte';

	export let cameraName: string
	export let targetName: string = ''
	export let animate: Omit<OrbitControlsAnimationOptions, 'target'> = {}
	export let dampingOptions: OrbitControlsDampingOptions = {}

	const controller = new OrbitControlsController({
		camera: $camera,
		domElement: $renderer.domElement
	})

	controller.dampingOptions(dampingOptions)

	onMount(() => {
		const target = $scene.getObjectByName(targetName)

		controller.animate({ ...animate, target: target?.position || undefined })
	})
</script>
