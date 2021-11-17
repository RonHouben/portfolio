<script lang="ts">
	import {
		MeshController,
		MeshAnimateFunction,
		MeshObjectInteractionFunction,
		MeshControllerOptions
	} from '../../../controllers/threejs/objects/mesh.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import { raycasterStore } from '../../../stores/threejs/raycaster.store'

	export let options: Omit<Omit<MeshControllerOptions, 'scene'>, 'raycaster'>
	export let animate: MeshAnimateFunction | undefined = undefined
	export let onClick: MeshObjectInteractionFunction | undefined = undefined

	const meshController = new MeshController({
		...options,
		scene: $sceneStore,
		onClick
	})

	if (animate) {
		animate(meshController.three, meshController.scene)
	}

	addEventListener('mousedown', () => {
		meshController.three.dispatchEvent({
			type: 'click'
		})
	})

	$: meshController.update({ ...options, raycasterIntersects: $raycasterStore.intersects })
</script>
