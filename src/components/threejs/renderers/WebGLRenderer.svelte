<script lang="ts">
	import { onMount } from 'svelte'
	import type { WebGLRendererControllerOptions } from '../../../controllers/threejs/renderers/webGL.renderer.controller'
	import { WebGLRendererController } from '../../../controllers/threejs/renderers/webGL.renderer.controller'
	import { camera } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { scene } from '../../../stores/threejs/scene.store'

	export let options: WebGLRendererControllerOptions['options']
	export let domElementId: WebGLRendererControllerOptions['domElementId']
	export let width: number | undefined = undefined
	export let height: number | undefined = undefined
	export let shadowMap: WebGLRendererControllerOptions['shadowMap']
	export let outputEncoding: WebGLRendererControllerOptions['outputEncoding']
	export let pixelRatio: WebGLRendererControllerOptions['pixelRatio'] = window.devicePixelRatio

	onMount(() => {
		new WebGLRendererController({
			domElementId,
			scene: $scene,
			camera: $camera,
			width,
			height,
			outputEncoding,
			options,
			pixelRatio,
			shadowMap
		})
	})
</script>

<slot name="scenes">
	<!-- TODO: Create errorMessage component -->
	<p>
		Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
		`svelte:fragment` with `slot="scenes"` component?
	</p>
</slot>
