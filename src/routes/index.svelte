<script lang="ts">
	import { BoxBufferGeometry,Color,DoubleSide,MathUtils,MeshStandardMaterial,PlaneBufferGeometry } from 'three';
	import { useTheme } from '../actions/useTheme';
	import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte';
	import OrbitControls from '../components/threejs/controls/OrbitControls.svelte';
	import AmbientLight from '../components/threejs/lights/AmbientLight.svelte';
	import DirectionalLight from '../components/threejs/lights/DirectionalLight.svelte';
	import Mesh from '../components/threejs/objects/Mesh.svelte';
	import Scene from '../components/threejs/scenes/Scene.svelte';

	const { theme } = useTheme()

	const boxGeometry = new BoxBufferGeometry(1, 1, 1)
	const boxMaterial = new MeshStandardMaterial({ roughness: 0.5, metalness: 0.5, color: 0xff3e00 })

	const floorGeometry = new PlaneBufferGeometry(4, 4, 1)
	const floorMaterial = new MeshStandardMaterial({
		roughness: 0.5,
		metalness: 0.5,
		side: DoubleSide,
		color: 0xf7fafc
	})
</script>

<section>
	<Scene
		sceneId="test"
		background={new Color($theme.colors.background)}
		showStats
		showAxesHelper={false}
		showGridHelper={false}
	>
		<!-- Lights -->
		<svelte:fragment slot="lights">
			<AmbientLight intensity={0.01} />
			<DirectionalLight
				targetName="box"
				intensity={1.5}
				position={{
					x: 2,
					z: 0,
					y: 2
				}}
				castShadow
				showHelper={false}
			/>
		</svelte:fragment>
		<!-- Cameras -->
		<svelte:fragment slot="cameras">
			<PerspectiveCamera
				name="perspective"
				position={{ z: 5, y: 1 }}
			/>
		</svelte:fragment>
		<!-- Controls -->
		<svelte:fragment slot="controls">
			<OrbitControls cameraName="perspective" autoRotate />
		</svelte:fragment>
		<!-- Meshes -->
		<svelte:fragment slot="meshes">
			<Mesh
				name="box"
				geometry={boxGeometry}
				material={boxMaterial}
				position={{ x: 0, y: 1, z: 0 }}
				shadow={{ receiveShadow: true, castShadow: true }}
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
				shadow={{ receiveShadow: true }}
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
