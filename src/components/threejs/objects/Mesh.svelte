<script lang="ts">
	import {
		Geometry,
		MeshController,
		MeshMaterial
	} from '../../../controllers/threejs/objects/mesh.controller'
	import { onMount } from 'svelte'
	import type {
		AnimateOptions,
		PositionOptions,
		RotateOptions,
		ShadowOptions
	} from '../../../controllers/threejs/base.controller'
	import { scene } from '../../../stores/threejs/scene.store'

	export let name: string
	export let geometry: Geometry
	export let material: MeshMaterial
	export let shadow: ShadowOptions
	export let position: PositionOptions
	export let rotate: RotateOptions = {}
	export let animate: AnimateOptions = {}

		const meshController = new MeshController({ geometry, material, name, scene: $scene })

		meshController.position(position)
		meshController.rotate(rotate)
		meshController.shadow(shadow)

		meshController.animate(animate)

</script>
