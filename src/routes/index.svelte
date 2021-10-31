<script lang="ts">
	import { MathUtils } from 'three'
	import { BoxGeometry, Color, MeshStandardMaterial, PlaneBufferGeometry } from 'three'
	import { useTheme } from '../actions/useTheme'
	import AmbientLight from '../components/ThreeJS/AmbientLight.svelte'
	import DirectionalLight from '../components/ThreeJS/DirectionalLight.svelte'
	import Mesh from '../components/ThreeJS/Mesh.svelte'
	import PerspectiveCamera from '../components/ThreeJS/PerspectiveCamera.svelte'
	import Scene from '../components/ThreeJS/Scene.svelte'

	const { theme } = useTheme()

	const boxGeometry = new BoxGeometry(1, 1, 1)
	const boxMaterial = new MeshStandardMaterial({ color: undefined, wireframe: false })

	const floorGeometry = new PlaneBufferGeometry(4, 4, 1)
	const floorMaterial = new MeshStandardMaterial({ color: 'yellow' })
</script>

<section>
	<Scene
		sceneId="test"
		background={new Color($theme.colors.background)}
		showStats
		showAxesHelper
		showGridHelper
	>
		<!-- Lights -->
		<svelte:fragment slot="lights">
			<AmbientLight color="yellow" intensity={0.01} />
			<DirectionalLight
				color="purple"
				targetName="box"
				intensity={1.5}
				position={{
					x: 1,
					z: 0,
					y: 0
				}}
				showHelper
			/>
		</svelte:fragment>
		<!-- Camera -->
		<PerspectiveCamera
			slot="camera"
			fov={70}
			aspect={window.innerWidth / window.innerHeight}
			far={0.1}
			near={1000}
			position={{ z: 5, y: 1 }}
			rotate={{ y: 0 }}
		/>
		<!-- Meshes -->
		<svelte:fragment slot="meshes">
			<Mesh
				name="box"
				geometry={boxGeometry}
				material={boxMaterial}
				position={{ x: 0, y: 0.5, z: 0 }}
				rotate={{ y: 1 }}
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
				position={{ y: 0 }}
				rotate={{ x: MathUtils.degToRad(-90) }}
			/>
		</svelte:fragment>
	</Scene>
</section>

<style>
	section {
		display: flex;
		height: 100%;
		align-items: center;
	}
</style>
