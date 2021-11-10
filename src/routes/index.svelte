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
	import { DoubleSide } from 'three'
	import { BoxGeometry } from 'three'
	import { PlaneGeometry } from 'three'
	import SpotLight from '../components/threejs/lights/SpotLight.svelte'
	import { sRGBEncoding } from 'three'
	import { MeshPhongMaterial } from 'three'
	import { MultiplyOperation } from 'three'
	import anime from 'animejs'
	import { SphereGeometry } from 'three'

	interface Slide {
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

	function positionInCircle<T extends Positional>(radius: number, center: number, height: number, items: T[]): T[] {
		return items.reduce((result, item, index, array) => {
			const angle = index * Math.PI * 2 / array.length

			return [
				...result,
				{
					...item,
					position: {
						...item.position,
						x: center + Math.cos(angle) * radius,
						y: height,
						z: center + Math.sin(angle) * radius,
					}
				} as T
			]
		}, [] as T[])
	}

	const slides: Slide[] = positionInCircle<Slide>(
		50,
		0,
		25,
		new Array(20)
			.fill(undefined)
			.map((x, i) => ({ name: `slide-${i}`, position: { x: 0, y: 0, z: 0 } }))
	)
</script>

<section id="threejs">
	<WebGlRenderer
		parentId="threejs"
		outputEncoding={sRGBEncoding}
		shadowMap={{
			enabled: true,
			type: PCFSoftShadowMap
		}}
		antialias={true}
		alpha={true}
	>
		<svelte:fragment slot="scenes">
			<Scene name="scene-one" background={new Color($theme.colors.background)}>
				<svelte:fragment slot="helpers">
					<!-- <AxesHelper size={100} /> -->
				</svelte:fragment>
				<!-- Cameras -->
				<!-- TODO: implement support for multiple camera's & viewports -->

						<!-- position={{ x: 10, y: 60, z: 180 }} -->
				<svelte:fragment slot="cameras">
					<PerspectiveCamera
						name="perspective"
						position={{ x: 0, y: 235, z: 0 }}
						rotate={{
							// x: 5
						}}
						fov={55}
						aspect={window.innerWidth / window.innerHeight}
						near={1}
						far={1000}
					/>
				</svelte:fragment>

				<!-- Controls -->
				<svelte:fragment slot="controls">
					<OrbitControls
						cameraName="perspective"
						animate={{ autoRotate: false, autoRotateSpeed: 2.5 }}
						dampingOptions={{ enableDamping: true }}
					/>
				</svelte:fragment>

				<!-- Lights -->
				<svelte:fragment slot="lights">
					<AmbientLight color={$theme.colors.background} intensity={0.75} />
					<!-- <HemisphereLight intensity={4} skyColor={0xffffbb} groundColor={0x080820} /> -->

						<!-- position={{ x: 15, y: 50, z: 35 }} -->
					<SpotLight
						options={{
							name: 'spotlight',
							angle: Math.PI / 4,
							color: new Color($theme.colors.background),
							decay: 1,
							distance: 2000,
							intensity: 1,
							penumbra: 0.1
						}}
						targetName="box"
						position={{ x: 0, y: 80, z: 0 }}
						shadow={{
							castShadow: true,
							mapSize: {
								height: 512,
								width: 512
							}
						}}
						helperOptions={{
							light: { enabled: false },
							shadowCamera: { enabled: false }
						}}
					/>
				</svelte:fragment>

				<!-- Meshes -->
				<svelte:fragment slot="meshes">
					{#each slides as slide}
						<Mesh
							name={`${slide.name}`}
							material={new MeshPhongMaterial({ color: 0x4080ff })}
							geometry={new SphereGeometry(5)}
							position={slide.position}
							shadow={{
								castShadow: true,
								receiveShadow: true
							}}
						/>
					{/each}

					<Mesh
						name="box"
						material={new MeshPhongMaterial({
							color: 0x9931ff,
							dithering: true,
							shininess: 90,
							emissive: 0x0,
							specular: 0x111111,
							fog: true,
							reflectivity: 0.9,
							refractionRatio: 0.98,
							combine: MultiplyOperation
						})}
						geometry={new BoxGeometry(10, 10, 10)}
						position={{
							x: 0,
							y: 5,
							z: 0
						}}
						shadow={{
							castShadow: true,
							receiveShadow: true
						}}
						animate={(obj) => {
							const timeline = anime.timeline({
								easing: 'easeOutElastic(1.5, .4)',
								duration: 2000,
								loop: true
							})

							timeline
								.add({
									targets: obj.position,
									y: 25
								})
								.add({
									targets: obj.position,
									x: 30
								})
								.add({
									targets: obj.position,
									x: -30
								})
								.add({
									targets: obj.position,
									x: 0
								})
								.add({
									targets: obj.position,
									y: 5
								})
						}}
					/>
					<Mesh
						name="plane"
						material={new MeshPhongMaterial({ color: $theme.colors.background, dithering: true, side: DoubleSide })}
						geometry={new PlaneGeometry(2000, 2000)}
						shadow={{
							receiveShadow: true
						}}
						rotate={{
							x: -Math.PI * 0.5
						}}
						position={{
							x: 0,
							y: -1,
							z: 0
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
