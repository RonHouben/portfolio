<script lang="ts">
	import { Color } from 'three'
	import { useTheme } from '../actions/useTheme'
	import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte'
	import OrbitControls from '../components/threejs/controls/OrbitControls.svelte'
	import AmbientLight from '../components/threejs/lights/AmbientLight.svelte'
	import Mesh from '../components/threejs/objects/Mesh.svelte'
	import Scene from '../components/threejs/scenes/Scene.svelte'
	import WebGlRenderer from '../components/threejs/renderers/WebGLRenderer.svelte'
	import { PCFSoftShadowMap } from 'three'
	import { BoxGeometry } from 'three'
	import SpotLight from '../components/threejs/lights/SpotLight.svelte'
	import { sRGBEncoding } from 'three'
	import { MeshPhongMaterial } from 'three'
	import { MultiplyOperation } from 'three'
	import anime from 'animejs'
	import { SphereGeometry } from 'three'
	import Raycaster from '../components/threejs/Raycaster.svelte'
	import { PlaneGeometry } from 'three'
	import { DoubleSide } from 'three'
	import type { MeshObjectInteractionFunction } from '../controllers/threejs/objects/mesh.controller'

	interface Sphere {
		name: string
		position: {
			x: number
			y: number
			z: number
		}
	}

	const { theme } = useTheme()
	interface Positional {
		position: {
			x: number
			y: number
			z: number
		}
	}

	function positionInCircle<T extends Positional>(
		radius: number,
		center: number,
		height: number,
		items: T[]
	): T[] {
		return items.reduce((result, item, index, array) => {
			const angle = (index * Math.PI * 2) / array.length

			return [
				...result,
				{
					...item,
					position: {
						...item.position,
						x: center + Math.cos(angle) * radius,
						y: height,
						z: center + Math.sin(angle) * radius
					}
				} as T
			]
		}, [] as T[])
	}

	const spheres: Sphere[] = positionInCircle<Sphere>(
		50,
		0,
		25,
		new Array(20)
			.fill(undefined)
			.map((_x, i) => ({ name: `sphere-${i}`, position: { x: 0, y: 0, z: 0 } }))
	)

	const handleSphereClick: MeshObjectInteractionFunction = (sphere, scene) => {
		const box = scene.getObjectByName('box')

		if (box) {
			const timeline = anime.timeline({
				easing: 'spring(1, 50, 10, 0)'
			})

			timeline.add({
				targets: box.position,
				x: sphere.position.x,
				y: sphere.position.y,
				z: sphere.position.z,
				begin: () => {
					sphere.material.visible = false
				}
			})

			// timeline.add({
			// 	targets: sphere.material,
			// 	opacity: 0,
			// 	x: 0,
			// 	y: 0,
			// 	z: 0,
			// 	// begin: () => {
			// 	// 	sphere.material.visible = false
			// 	// }
			// })
		}
	}
</script>

<section id="threejs">
	<WebGlRenderer
		options={{
			alpha: true,
			antialias: true,
			domElementId: 'threejs',
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
					name: 'scene-one',
					background: new Color($theme.colors.background)
				}}
			>
				<svelte:fragment slot="helpers">
					<!-- <AxesHelper options={{ size: 200 }} /> -->
					<!-- <CameraHelper options={{ cameraName: 'perspective' }} /> -->
					<!-- <GridHelper options={{ size: 200, divisions: 50 }} /> -->
				</svelte:fragment>
				<!-- Cameras -->
				<!-- TODO: implement support for multiple camera's & viewports -->
				<svelte:fragment slot="cameras">
					<PerspectiveCamera
						options={{
							name: 'perspective',
							position: {
								x: 0,
								y: 235,
								z: 0
							},
							fov: 55,
							near: 1,
							far: 1000
						}}
					/>
				</svelte:fragment>

				<!-- Controls -->
				<svelte:fragment slot="controls">
					<OrbitControls
						options={{
							cameraName: 'perspective',
							enableDamping: true,
							maxPolarAngle: 1.5,
							minDistance: 50,
							maxDistance: 500
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
							color: new Color($theme.colors.background),
							intensity: 0.75
						}}
					/>
					<SpotLight
						options={{
							name: 'spotlight',
							targetName: 'box',
							angle: Math.PI / 4,
							color: new Color($theme.colors.background),
							decay: 1,
							distance: 2000,
							intensity: 1,
							penumbra: 0.1,
							position: {
								x: 0,
								y: 80,
								z: 0
							},
							shadow: {
								castShadow: true,
								mapSize: {
									height: 512,
									width: 512
								}
							}
						}}
					/>
				</svelte:fragment>

				<!-- Meshes -->
				<svelte:fragment slot="meshes">
					{#each spheres as sphere}
						<Mesh
							options={{
								name: sphere.name,
								material: new MeshPhongMaterial({ color: 0x4080ff }),
								geometry: new SphereGeometry(5),
								position: sphere.position,
								shadow: {
									castShadow: true,
									receiveShadow: true
								}
							}}
							onClick={handleSphereClick}
						/>
					{/each}

					<Mesh
						options={{
							name: 'box',
							material: new MeshPhongMaterial({
								color: 0x9931ff,
								dithering: true,
								shininess: 90,
								emissive: 0x0,
								specular: 0x111111,
								fog: true,
								reflectivity: 0.9,
								refractionRatio: 0.98,
								combine: MultiplyOperation
							}),
							geometry: new BoxGeometry(10, 10, 10),
							position: {
								x: 0,
								y: 5,
								z: 0
							},
							shadow: {
								castShadow: true,
								receiveShadow: true
							}
						}}
					/>
					<Mesh
						options={{
							name: 'plane',
							material: new MeshPhongMaterial({
								color: $theme.colors.background,
								dithering: true,
								side: DoubleSide
							}),
							geometry: new PlaneGeometry(2000, 2000),
							position: {
								x: 0,
								y: -1,
								z: 0
							},
							rotation: {
								x: -Math.PI * 0.5
							},
							shadow: {
								receiveShadow: true
							}
						}}
					/>
				</svelte:fragment>
			</Scene>
		</svelte:fragment>
	</WebGlRenderer>
</section>

<style>
	section {
		display: flex;
		height: 100%;
		align-items: center;
	}
</style>
