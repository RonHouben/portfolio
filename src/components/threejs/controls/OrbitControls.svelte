<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store'
	import { OrbitControls } from '../../../lib/threejs/OrbitControls'
	import type { Camera } from 'three'
	import { onMount } from 'svelte'
	import { renderer } from '../../../stores/threejs/renderer.store';

	export let cameraName: string
	export let autoRotate: boolean = false

	const camera = $scene.getObjectByName(cameraName) as Camera

	const animationLoop = (controls: OrbitControls) => {
		requestAnimationFrame(() => animationLoop(controls))

		controls.update()
	}


	onMount(() => {
		if (!camera) {
			console.error(`Couldn't find camera with name "${cameraName}"`)
		} else {
			const controls = new OrbitControls(camera, $renderer.domElement)

			controls.autoRotate = autoRotate

			controls.update()

			animationLoop(controls)
		}
	})
</script>
