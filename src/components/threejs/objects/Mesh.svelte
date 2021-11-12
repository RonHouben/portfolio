<script lang="ts">
	import {
		Geometry,
		MeshController,
		MeshMaterial,
		MeshAnimateFunction,
		MeshOnMousemoveFunction
	} from '../../../controllers/threejs/objects/mesh.controller'
	import type {
		PositionOptions,
		RotateOptions,
		ShadowOptions
	} from '../../../controllers/threejs/base.controller'
	import { scene } from '../../../stores/threejs/scene.store'
	import { raycaster } from '../../../stores/threejs/raycaster.store'
	import type { Mesh } from 'three'

	export let name: string
	export let geometry: Geometry
	export let material: MeshMaterial
	export let shadow: ShadowOptions = {}
	export let position: PositionOptions
	export let rotate: RotateOptions = {}
	export let animate: MeshAnimateFunction = () => {}
	export let onMousemove: MeshOnMousemoveFunction = () => {}

	const meshController = new MeshController({ geometry, material, name, scene: $scene })

	$: meshController.position(position)
	$: meshController.rotate(rotate)
	$: meshController.shadow(shadow)
	$: meshController.setMaterial(material)
	$: meshController.animate(animate)

	// raycaster onClick function
	$: intersected = $raycaster.intersects.find(({ object }) => object.name === name)

	$: if (intersected) {
		onMousemove(intersected.object as unknown as Mesh)
	}
</script>
