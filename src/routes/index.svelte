<script lang="ts">
	import Mesh from '../components/threejs/objects/Mesh.svelte'
	import { MeshPhysicalMaterial } from 'three'
	import { PCFSoftShadowMap, sRGBEncoding } from 'three'
	import { useTheme } from '../actions/useTheme'
	import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte'
	import AmbientLight from '../components/threejs/lights/AmbientLight.svelte'
	import Raycaster from '../components/threejs/Raycaster.svelte'
	import WebGlRenderer from '../components/threejs/renderers/WebGLRenderer.svelte'
	import Scene from '../components/threejs/scenes/Scene.svelte'
	import { MouseHelper } from '$lib/threejs/MouseHelper'
	import { IcosahedronGeometry } from 'three'
	import DirectionalLight from '../components/threejs/lights/DirectionalLight.svelte'
	import anime from 'animejs'
	import SpotLight from '../components/threejs/lights/SpotLight.svelte'
	import Grid from '../components/Grid.svelte'

	const { theme, toggle } = useTheme()
</script>

<div class="canvas-container">
	<WebGlRenderer
		options={{
			alpha: true,
			antialias: true,
			outputEncoding: sRGBEncoding,
			shadowMap: {
				enabled: true,
				type: PCFSoftShadowMap
			}
		}}
	>
		<svelte:fragment slot="scenes">
			<Scene
				options={{
					name: 'scene'
				}}
			>
				<svelte:fragment slot="cameras">
					<PerspectiveCamera
						options={{
							name: 'perspective',
							position: {
								x: 0,
								y: 0,
								z: 7
							},
							rotation: {
								// x: 0.5
							},
							fov: 50,
							near: 2,
							far: 1000
						}}
					/>
				</svelte:fragment>
				<!-- Raycaster -->
				<Raycaster options={{ cameraName: 'perspective' }} slot="raycaster" />

				<!-- Lights -->
				<svelte:fragment slot="lights">
					<AmbientLight
						options={{
							name: 'ambient-light',
							color: '#08313A',
							intensity: 0.75
						}}
					/>
					<SpotLight
						options={{
							name: 'spotlight-left',
							targetName: 'ball',
							color: '#5CD85A',
							intensity: 4,
							position: {
								y: 10,
								x: -10
							}
						}}
					/>
					<SpotLight
						options={{
							name: 'spotlight-right',
							targetName: 'ball',
							color: '#107869',
							position: {
								y: 10,
								x: 10
							}
						}}
					/>
					<DirectionalLight
						options={{
							name: 'directional-light-bottom',
							color: '#055F66',
							targetName: 'ball',
							position: {
								y: -10
							}
						}}
					/>
				</svelte:fragment>
				<!-- Meshes -->
				<svelte:fragment slot="meshes">
					<Mesh
						options={{
							geometry: new IcosahedronGeometry(0.25),
							material: new MeshPhysicalMaterial({
								clearcoat: 0.5,
								metalness: 1,
								// wireframe: true
							}),
							name: 'ball',
							position: {
								x: 0,
								y: 0,
								z: 1
							},
							shadow: {
								castShadow: true,
								receiveShadow: true
							}
						}}
						onClick={({ target, scene }) => {
							const grid = scene.getObjectByName('grid')

							if (grid) {
								grid.children.forEach((child) => {
									child.material.wireframe = !child.material.wireframe
								})
							}

							anime({
								targets: target.rotation,
								x: target.rotation.x + Math.random() * 10,
								y: target.rotation.y + Math.random() * 10,
								begin: () => {
									target.material.wireframe = !target.material.wireframe

									toggle()
								}
							})
						}}
						onMousemove={({ target, mousePosition }) => {
							MouseHelper.followMouse(mousePosition.x, mousePosition.y, target, {
								targets: [target.rotation],
								x: +1,
								y: +1
							})
						}}
					/>

					<Grid
						name="grid"
						rows={10}
						columns={10}
						depth={2}
						cellDistance={0.25}
						cellSize={0.25}
						position={{
							x: -(10 / 4) + 0.25,
							y: -(10 / 4) + 0.25
						}}
					/>
				</svelte:fragment>
			</Scene>
		</svelte:fragment>
	</WebGlRenderer>
</div>

<section>
	<h1 style="user-select: none;">HELLO WORLD</h1>
</section>

<style>
	section {
		padding-left: var(--theme-spacing-padding-sm);
	}
	.canvas-container {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		height: 100vh;
		z-index: 1;
		cursor: none;
	}
</style>
