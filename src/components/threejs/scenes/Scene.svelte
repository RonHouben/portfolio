<script lang="ts">
	import { SceneController, SceneControllerOptions } from '../../../controllers/threejs/objects/scene.controller';

	type SceneOptions = Omit<SceneControllerOptions, 'scene'>

	export let options: SceneOptions

	const sceneController = new SceneController(options)

	$: sceneController.update(options)

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
