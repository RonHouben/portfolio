<script lang="ts">
	import DebugPanel from '../components/threejs/DebugPanel.svelte'
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
	import DirectionalLight from '../components/threejs/lights/DirectionalLight.svelte'
	import anime from 'animejs'

	const { theme } = useTheme()
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
		<DebugPanel
			slot="debug-panel"
			options={{
				showAxesHelper: false,
				showGridHelper: false,
				showFPS: false
			}}
		/>
		<svelte:fragment slot="scenes">
			<Scene name="scene-one" background={new Color($theme.colors.background)}>
				<!-- Cameras -->
				<svelte:fragment slot="cameras">
					<PerspectiveCamera
						name="perspective"
						position={{ x: 10, y: 60, z: 180 }}
						fov={35}
						aspect={window.innerWidth / window.innerHeight}
						near={1}
						far={1000}
					/>
				</svelte:fragment>

				<!-- Controls -->
				<svelte:fragment slot="controls">
					<OrbitControls
						cameraName="perspective"
						targetName="box"
						animate={{ autoRotate: false, autoRotateSpeed: 2.5 }}
						dampingOptions={{ enableDamping: true }}
					/>
				</svelte:fragment>

				<!-- Lights -->
				<svelte:fragment slot="lights">
					<AmbientLight color={0xffffff} intensity={0.5} />
					<!-- <HemisphereLight intensity={4} skyColor={0xffffbb} groundColor={0x080820} /> -->
					<SpotLight
						options={{
							name: 'spotlight',
							angle: Math.PI / 4,
							color: 0xffffff,
							decay: 1,
							distance: 2000,
							intensity: 2,
							penumbra: 0.1
						}}
						lookAt="box"
						position={{ x: 15, y: 50, z: 35 }}
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
					<DirectionalLight
						options={{
							name: 'directional-light',
							intensity: 0.5
						}}
						position={{
							x: 0,
							z: 0,
							y: 40
						}}
						shadow={{
							castShadow: true,
							mapSize: {
								width: 512,
								height: 512
							}
						}}
						helperOptions={{
							light: {
								enabled: true,
								color: 'green'
							}
						}}
					/>
				</svelte:fragment>

				<!-- Meshes -->
				<svelte:fragment slot="meshes">
					<Mesh
						name="box"
						material={new MeshPhongMaterial({
							color: 0x4080ff,
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
								easing: 'easeInOutElastic(1, .6)',
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
									x: 50
								})
								.add({
									targets: obj.position,
									y: 5
								})
						}}
					/>
					<Mesh
						name="plane"
						material={new MeshPhongMaterial({ color: 0x808080, dithering: true, side: DoubleSide })}
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
