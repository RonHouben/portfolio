<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store'
	import { OrbitControls } from '../../../lib/threejs/OrbitControls'
	import type { Camera } from 'three'
	import { onMount } from 'svelte'

	export let cameraName: string
	export let autoRotate: boolean = false

	const camera = $scene.getObjectByName(cameraName) as Camera

	onMount(() => {
		const domEl = document.getElementById('test')

		if (!camera) {
			console.error(`Couldn't find camera with name "${cameraName}"`)
		} else if (!domEl) {
			console.error(`Couldn't find dom element`)
		} else {
			const controls = new OrbitControls(camera, domEl)

			controls.autoRotate = autoRotate

			const animationLoop = () => {
				requestAnimationFrame(animationLoop)

				controls.update()
			}

			animationLoop()
		}
	})
</script>
