<script lang="ts">
	import type { Color, Texture } from 'three'
	import { Scene } from 'three'
	import { scene } from '../../../stores/threejs/scene.store'

	export let name: string = ''
	export let background: Color | Texture

	// set the scene store value to a new scene
	scene.set(new Scene())

	// TODO: Crate scene controller
	// set the scenes properties
	$: $scene.background = background
	$scene.name = name
</script>

	<slot name="lights" />
	<slot name="helpers" />
	<slot name="cameras">
		<!-- TODO: Create errorMessage component -->
		<p>
			Make sure to add a Camera component as a child! Did you forget to add the camera(s) in a
			`svelte:fragment` with `slot="cameras"` component?
		</p>
	</slot>
	<slot name="controls" />
	<slot name="raycaster" />
	<slot name="meshes" />
