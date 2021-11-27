<script lang="ts">
	import anime from 'animejs'
import { Vector3 } from 'three';
	import {
		AdditiveBlending,
		BufferGeometry,
		Color,
		DoubleSide,
		MeshPhongMaterial,
		PCFSoftShadowMap,
		PlaneGeometry,
		PointsMaterial,
		SphereGeometry,
		sRGBEncoding,
		TextureLoader
	} from 'three'
	import { useTheme } from '../actions/useTheme'
	import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte'
	import OrbitControls from '../components/threejs/controls/OrbitControls.svelte'
	import AmbientLight from '../components/threejs/lights/AmbientLight.svelte'
	import SpotLight from '../components/threejs/lights/SpotLight.svelte'
	import GLTFLoader from '../components/threejs/loaders/GLTFLoader.svelte'
	import LoadingManager from '../components/threejs/loaders/LoadingManager.svelte'
	import Mesh from '../components/threejs/objects/Mesh.svelte'
	import Points from '../components/threejs/objects/Points.svelte'
	import Raycaster from '../components/threejs/Raycaster.svelte'
	import WebGlRenderer from '../components/threejs/renderers/WebGLRenderer.svelte'
	import Scene from '../components/threejs/scenes/Scene.svelte'
	import { AnimationMixerController } from '../controllers/threejs/animation/animation.mixer.controller'
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
		10,
		0,
		1,
		new Array(20)
			.fill(undefined)
			.map((_x, i) => ({ name: `sphere-${i}`, position: { x: 0, y: 0, z: 0 } }))
	)

	const handleSphereClick: MeshObjectInteractionFunction = (sphere, scene) => {
		const model = scene.getObjectByName('3d-model')

		if (model) {
			const mixer = new AnimationMixerController(model)

			anime({
				targets: model.position,
				easing: 'easeInOutQuad',
				duration: 2000,
				x: sphere.position.x,
				y: sphere.position.y,
				z: sphere.position.z,
				begin: () => {
					mixer.playAnimationByName('moon_walk')
					model.lookAt(sphere.position)
				},
				complete: () => {
					sphere.material.visible = false
					mixer.playAnimationByName('wave')
				}
			})
		}
	}
</script>

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
				name: 'scene-one',
				background: new Color($theme.colors.background)
			}}
		>
			<LoadingManager
				slot="loading-manager"
				options={{
					loadingScreen: {
						enabled: true,
						backgroundColor: $theme.colors.background,
						fontFamily: $theme.fonts.find((f) => f.defaultFont)?.family
					},
					errorScreen: {
						enabled: true,
						backgroundColor: $theme.colors.background,
						fontFamily: $theme.fonts.find((f) => f.defaultFont)?.family
					}
				}}
			>
				<GLTFLoader
					slot="loader"
					options={{
						name: '3d-model',
						path: 'gltf-models/astronaut.glb',
						onLoaded: (gltf) => {
							const animationMixer = new AnimationMixerController(gltf.scene)
							animationMixer.playAnimationByName('idle')
						}
					}}
				/>
				<!-- <div slot="loading-screen">TEST</div> -->
			</LoadingManager>
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
							y: 2,
							z: 7
						},
						fov: 50,
						near: 2,
						far: 1000
					}}
				/>
			</svelte:fragment>

			<!-- Controls -->
			<svelte:fragment slot="controls">
				<OrbitControls
					options={{
						cameraName: 'perspective',
						targetName: '3d-model',
						enableDamping: true,
						maxPolarAngle: 1.5,
						minDistance: 1,
						maxDistance: 500
						// autoRotate: true
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
						targetName: '3d-model',
						angle: Math.PI / 4,
						color: new Color($theme.colors.background),
						decay: 1,
						distance: 150,
						intensity: 1,
						penumbra: 0.1,
						position: {
							x: 0,
							y: 5,
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
			<svelte:fragment slot="points">
				<Points
					options={{
						name: 'particles',
						geometry: new BufferGeometry(),
						material: new PointsMaterial({
							color: 'rgb(255, 255, 255)',
							map: new TextureLoader().load('/images/particle.png'),
							alphaTest: 0.5,
							transparent: true,
							sizeAttenuation: true,
							blending: AdditiveBlending,
							size: 0.25
						})
					}}
					createPoints={() => {
						const amount = 5000
						const distance = 50
						const points = []

						for (let i = 0; i < amount; i++) {
							const x = (Math.random() - 0.5) * distance
							const y = (Math.random() - 0.5) * distance
							const z = (Math.random() - 0.5) * distance

							const point = new Vector3(x, y, z)

							points.push(point)
						}

						return points
					}}
					animate={(obj) => {
						obj.rotateY(0.0001)
						// console.log(obj.animations)
						// animationMixer.playAllAnimations()
					}}
				/>
			</svelte:fragment>

			<!-- Meshes -->
			<svelte:fragment slot="meshes">
				{#each spheres as sphere}
					<Mesh
						options={{
							name: sphere.name,
							material: new MeshPhongMaterial({ color: 0x4080ff, opacity: 0.5, transparent: true, wireframe: true }),
							geometry: new SphereGeometry(1),
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
