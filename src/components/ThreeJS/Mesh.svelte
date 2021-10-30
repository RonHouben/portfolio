<script lang="ts">
	import { scene } from '../../stores/threejs/scene.store'
	import type { BoxGeometry, MeshBasicMaterial } from 'three'
	import { Mesh } from 'three'
	import { AnimationOptions, PositionOptions, ThreeController } from '../../controllers/three.controller'
import type { MeshStandardMaterial } from 'three';

	// TODO: Add other Geometry types and move them to a separate file
	type Geometry = BoxGeometry
	type MeshMaterial = MeshBasicMaterial | MeshStandardMaterial

	export let geometry: Geometry
	export let material: MeshMaterial
	export let position: PositionOptions
	export let animate: AnimationOptions = {}

	const mesh = new Mesh(geometry, material)
	const meshController = new ThreeController(mesh)

	$scene.add(mesh)

	// set mesh position
	meshController.position(position)

	// animation loopt
	meshController.animate(animate)
</script>
