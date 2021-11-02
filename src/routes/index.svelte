<script lang="ts">
	import DebugPanel from '../components/threejs/DebugPanel.svelte'
	import {
		BoxBufferGeometry,
		Color,
		DoubleSide,
		MathUtils,
		MeshStandardMaterial,
		PlaneBufferGeometry
	} from 'three'
	import { useTheme } from '../actions/useTheme'
	import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte'
	import OrbitControls from '../components/threejs/controls/OrbitControls.svelte'
	import AmbientLight from '../components/threejs/lights/AmbientLight.svelte'
	import DirectionalLight from '../components/threejs/lights/DirectionalLight.svelte'
	import Mesh from '../components/threejs/objects/Mesh.svelte'
	import Scene from '../components/threejs/scenes/Scene.svelte'
	import WebGlRenderer from '../components/threejs/renderers/WebGLRenderer.svelte'
	import { PCFShadowMap } from 'three'
import Layout from './__layout.svelte'

	const { theme } = useTheme()

	const boxGeometry = new BoxBufferGeometry(1, 1, 1)
	const boxMaterial = new MeshStandardMaterial({ roughness: 0.5, metalness: 0.5, color: 0xff3e00 })

	const floorGeometry = new PlaneBufferGeometry(8, 8, 1)
	const floorMaterial = new MeshStandardMaterial({
		roughness: 0.5,
		metalness: 0.5,
		side: DoubleSide,
		color: 0xf7fafc
	})
</script>

<section id="threejs">
	<WebGlRenderer
		parentId="threejs"
		shadowMap={{
			enabled: true,
			type: PCFShadowMap
		}}
	>
		<DebugPanel
			slot="debug-panel"
			options={{
				showAxesHelper: false,
				showGridHelper: false,
				showFPS: false,
				directionalLights: [{ name: 'directional-light-1', showHelper: false }]
			}}
		/>
		<svelte:fragment slot="scenes">
			<Scene name="scene-one" background={new Color($theme.colors.background)}>
				<!-- Lights -->
				<svelte:fragment slot="lights">
					<AmbientLight intensity={0.01} />
					<DirectionalLight
						name="directional-light-1"
						intensity={1}
						position={{
							x: 2.5,
							z: 0,
							y: 5
						}}
						rotate={{
							z: -0.25
						}}
						castShadow
					/>
				</svelte:fragment>
				<!-- Cameras -->
				<svelte:fragment slot="cameras">
					<PerspectiveCamera
						name="perspective"
						position={{ z: 10, y: 10 }}
						fov={75}
						aspect={window.innerWidth / window.innerHeight}
						near={0.1}
						far={1000}
					/>
				</svelte:fragment>
				<!-- Controls -->
				<svelte:fragment slot="controls">
					<OrbitControls cameraName="perspective" />
				</svelte:fragment>
				<!-- Meshes -->
				<svelte:fragment slot="meshes">
					<Mesh
						name="box"
						geometry={boxGeometry}
						material={boxMaterial}
						position={{ x: 0, y: 1, z: 0 }}
						shadow={{ receiveShadow: true, castShadow: true }}
						animate={{
							rotateY: 0.01
							// translateX: {
							// distance: 0.01,
							// limit: 1
							// },
							// translateZ: {
							// distance: 0.01,
							// limit: 2.5
							// }
						}}
					/>
					<Mesh
						name="floor"
						geometry={floorGeometry}
						material={floorMaterial}
						shadow={{ receiveShadow: true }}
						position={{ y: 0 }}
						rotate={{ x: MathUtils.degToRad(-90) }}
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
