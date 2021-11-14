<script lang="ts">
	import {
		MeshGeometry,
		MeshController,
		MeshMaterial,
		MeshAnimateFunction,
		MeshOnMousemoveFunction,
		MeshControllerOptions
	} from '../../../controllers/threejs/objects/mesh.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import { raycasterStore } from '../../../stores/threejs/raycaster.store'
	import type { Mesh } from 'three'

	type MeshOptions = Omit<MeshControllerOptions, 'scene'>

	export let options: MeshOptions
	export let animate: MeshAnimateFunction | undefined = undefined
	export let onMousemove: MeshOnMousemoveFunction | undefined = undefined
	export let onClick: MeshOnMousemoveFunction | undefined = undefined

	const meshController = new MeshController({
		...options,
		scene: $sceneStore
	})

	if (animate) {
		animate(meshController.three)
	}

	$: if ($raycasterStore) {
		// TODO: make method in controller
		const intersected = $raycasterStore.intersects.find(({ object }) => object.name === options.name)

		if (intersected) {
			const mesh = intersected.object as unknown as Mesh<MeshGeometry, MeshMaterial>

			if (onMousemove) {
				onMousemove(mesh)
			}

			if (onClick) {
				onClick(mesh)
			}
		}
	}

	$: meshController.update(options)
</script>
