<script lang="ts">
	import { onMount } from 'svelte'
	import type { WebGLRendererControllerOptions } from '../../../controllers/threejs/renderers/webGL.renderer.controller'
	import { WebGLRendererController } from '../../../controllers/threejs/renderers/webGL.renderer.controller'
	import { cameraStore } from '../../../stores/threejs/cameras/perspective.camera.store'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	type WebGLRendererOptions = Omit<Omit<WebGLRendererControllerOptions, 'scene'>, 'camera'>

	export let options: WebGLRendererOptions

	onMount(() => {
		new WebGLRendererController({ ...options, scene: $sceneStore, camera: $cameraStore })
	})
</script>

<slot name="scenes">
	<!-- TODO: Create errorMessage component -->
	<p>
		Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
		`svelte:fragment` with `slot="scenes"` component?
	</p>
</slot>
