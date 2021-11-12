<script lang="ts">
	import { onMount } from 'svelte'
	import type { TextureEncoding } from 'three'
	import type { WebGLShadowMap } from 'three'
	import { WebGLRenderer } from 'three'
	import { camera } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { renderer } from '../../../stores/threejs/renderer.store'
	import { scene } from '../../../stores/threejs/scene.store'

	export let parentId: string
	export let width: number = window.innerWidth
	export let height: number = window.innerHeight
	export let antialias: boolean | undefined = undefined
	export let alpha: boolean | undefined = undefined
	export let shadowMap: Partial<WebGLShadowMap> = {}
	export let outputEncoding: TextureEncoding

	// TODO: create Renderer controller
	const webGLRenderer = new WebGLRenderer({
		antialias,
		alpha
	})

	renderer.set(webGLRenderer)

	$renderer.setPixelRatio(window.devicePixelRatio)
	$renderer.outputEncoding = outputEncoding

	if (shadowMap.enabled) {
		$renderer.shadowMap.enabled = shadowMap.enabled
	}

	if (shadowMap.type) {
		$renderer.shadowMap.type = shadowMap.type
	}

	render()

	function render() {
		requestAnimationFrame(render)

		if ($renderer && $scene) {
			$renderer.render($scene, $camera)
		}
	}

	addEventListener('resize', onWindowResize, false)

	onMount(() => {
		const parentElement = document.getElementById(parentId)

		if (!parentElement) {
			console.error(`Couldn't find element with id ${parentElement}`)
		} else {
			// add renderer to the DOM
			parentElement.appendChild($renderer.domElement)

			width = parentElement.offsetWidth
			height = parentElement.offsetHeight

			$renderer.setSize(width, height)
		}
	})


	function onWindowResize() {
		const parentElement = document.getElementById(parentId)

		if (!parentElement) {
			console.error(`Couldn't find element with id ${parentElement}`)
		} else {
			const width: number = parentElement.offsetWidth
			const height: number = parentElement.offsetHeight

			$renderer.setSize(width, height)

			$camera.aspect = width / height
    	$camera.updateProjectionMatrix();
		}
	}
</script>

<slot name="debug-panel" />
<slot name="scenes">
	<!-- TODO: Create errorMessage component -->
	<p>
		Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
		`svelte:fragment` with `slot="scenes"` component?
	</p>
</slot>
