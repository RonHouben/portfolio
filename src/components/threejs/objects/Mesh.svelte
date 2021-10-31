<script lang="ts">
	import type { BoxGeometry,MeshBasicMaterial,MeshStandardMaterial,PlaneBufferGeometry } from 'three';
	import { Mesh } from 'three';
	import {
	AnimationOptions,
	PositionOptions,
	RotateOptions,
	ShadowOptions,
	ThreeController
	} from '../../../controllers/three.controller';
	import { scene } from '../../../stores/threejs/scene.store';

	// TODO: Add other Geometry types and move them to a separate file
	type Geometry = BoxGeometry | PlaneBufferGeometry
	type MeshMaterial = MeshBasicMaterial | MeshStandardMaterial

	export let name: string
	export let geometry: Geometry
	export let material: MeshMaterial
	export let shadow: ShadowOptions
	export let position: PositionOptions
	export let rotate: RotateOptions = {}
	export let animate: AnimationOptions = {}

	const mesh = new Mesh(geometry, material)

	// TODO: move to ThreeController
	const meshController = new ThreeController(mesh, name)

	$scene.add(mesh)

	// set mesh position
	meshController.position(position)
	meshController.rotate(rotate)

	meshController.setShadows(shadow)

	// animation loopt
	meshController.animate(animate)
</script>
