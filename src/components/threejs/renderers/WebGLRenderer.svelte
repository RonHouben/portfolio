<script lang="ts">
	import { onMount } from 'svelte'
import type { TextureEncoding } from 'three';
	import type { WebGLShadowMap } from 'three'
	import { WebGLRenderer } from 'three'
	import { camera } from '../../../stores/threejs/perspective.camera.store'
	import { renderer } from '../../../stores/threejs/renderer.store'
	import { scene } from '../../../stores/threejs/scene.store'

	export let parentId: string
	export let height: number = 0
	export let width: number = 0
	export let antialias: boolean | undefined = undefined
	export let alpha: boolean | undefined = undefined
	export let shadowMap: Partial<WebGLShadowMap> = {}
	export let outputEncoding: TextureEncoding

	const webGLRenderer = new WebGLRenderer({
			antialias,
			alpha
		})
	
	renderer.set(webGLRenderer)

	// TODO: create Renderer controller
	$: $renderer.setSize(width, height)
	// $: $renderer.shadowMap = { ...$renderer.shadowMap, ...shadowMap } as WebGLShadowMap

	$renderer.setPixelRatio( window.devicePixelRatio )
	$renderer.outputEncoding = outputEncoding

	if (shadowMap.enabled) {
		$renderer.shadowMap.enabled = shadowMap.enabled
	}
	
	if (shadowMap.type) {
		$renderer.shadowMap.type = shadowMap.type
	}

	animate()

	// animation loop function
	function animate() {
		requestAnimationFrame(animate)

		if ($renderer && $scene) {
			$renderer.render($scene, $camera)
		}
	}

	onMount(() => {
		const parentElement = document.getElementById(parentId)

		if (!parentElement) {
			console.error(`Couldn't find element with id ${parentElement}`)
		} else {
			// add renderer to the DOM
			parentElement.appendChild($renderer.domElement)

			// set height && width based on the parentsElement
			// if the width || height is not given as a prop to the Scene component
			if (!height) {
				height = parentElement.offsetHeight
			}
			if (!width) {
				width = parentElement.offsetWidth
			}
		}
	})
</script>

<slot name="debug-panel" />
<slot name="scenes">
	<!-- TODO: Create errorMessage component -->
	<p>
		Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
		`svelte:fragment` with `slot="scenes"` component?
	</p>
</slot>
