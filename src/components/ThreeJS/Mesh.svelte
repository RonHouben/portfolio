<script lang="ts">
	import { scene } from '../../stores/threejs/scene.store'
	import type { BoxGeometry, MeshBasicMaterial } from 'three'
	import { Mesh } from 'three'
	import type { AnimationProps, PositionProps } from './types'
	import { ThreeController } from '../../controllers/three.controller'

	// TODO: Add other Geometry types and move them to a separate file
	type Geometry = BoxGeometry
	type MeshMaterial = MeshBasicMaterial

	export let geometry: Geometry
	export let material: MeshMaterial
	export let position: PositionProps
	export let animate: AnimationProps = {}

	const mesh = new Mesh(geometry, material)
	const meshController = new ThreeController(mesh)

	$scene.add(mesh)

	// set mesh position
	meshController.position(position)

	// animation loopt
	meshController.animate(animate)
</script>
