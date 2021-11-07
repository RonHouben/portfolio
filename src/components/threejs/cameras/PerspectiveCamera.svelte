<script lang="ts">
	import type {
		AnimateOptions,
		PositionOptions,
		RotateOptions,
	} from '../../../controllers/threejs/base.controller'
	import { camera } from '../../../stores/threejs/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store'
	import { onMount } from 'svelte'
import { PerspectiveCameraController } from '../../../controllers/threejs/cameras/perspective.camera';

	export let name: string
	export let fov: number | undefined = undefined
	export let aspect: number | undefined = undefined
	export let near: number | undefined = undefined
	export let far: number | undefined = undefined
	export let position: PositionOptions
	export let animate: AnimateOptions = {}
	export let rotate: RotateOptions = {}
	export let lookAt : string = ''


	const cameraController = new PerspectiveCameraController({
		name,
		scene: $scene,
		fov,
		aspect,
		near,
		far
	})

	// set camera position
	cameraController.position(position)
	cameraController.rotate(rotate)

	// set camera store state
	camera.set(cameraController.three)

	onMount(() => {
		const target = $scene.getObjectByName(lookAt)

		if (target) {
			cameraController.animate({ ...animate, lookAt: target.position })
		}

		cameraController.animate(animate)
	})
</script>
