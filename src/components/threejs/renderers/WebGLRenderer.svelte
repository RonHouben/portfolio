<script lang="ts">
	import { onMount } from 'svelte'
	import type { WebGLRendererControllerOptions } from '../../../controllers/threejs/renderers/webGL.renderer.controller'
	import { WebGLRendererController } from '../../../controllers/threejs/renderers/webGL.renderer.controller'

	export let options: WebGLRendererControllerOptions

	onMount(() => {
		new WebGLRendererController(options)
	})
</script>

<slot name="scenes">
	<!-- TODO: Create errorMessage component -->
	<p>
		Make sure to add a Scene component as a child! Did you forget to add the scene(s) in a
		`svelte:fragment` with `slot="scenes"` component?
	</p>
</slot>
