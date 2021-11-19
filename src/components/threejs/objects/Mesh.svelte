<script lang="ts">
	import {
		MeshController,
		MeshAnimateFunction,
		MeshObjectInteractionFunction,
		MeshControllerOptions
	} from '../../../controllers/threejs/objects/mesh.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let options: MeshControllerOptions
	export let animate: MeshAnimateFunction | undefined = undefined
	export let onClick: MeshObjectInteractionFunction | undefined = undefined

	const meshController = new MeshController({ ...options, onClick })

	if (animate) {
		animate(meshController.three, $sceneStore)
	}

	addEventListener('mousedown', () => {
		meshController.three.dispatchEvent({
			type: 'click'
		})
	})

	$: meshController.update(options)
</script>
