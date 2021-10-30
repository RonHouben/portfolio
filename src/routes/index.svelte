<script lang="ts">
	import Mesh from '../components/ThreeJS/Mesh.svelte'
	import { Color } from 'three'
	import { useTheme } from '../actions/useTheme'
	import PerspectiveCamera from '../components/ThreeJS/PerspectiveCamera.svelte'
	import Scene from '../components/ThreeJS/Scene.svelte'
	import { BoxGeometry } from 'three'
	import { MeshBasicMaterial } from 'three'

	const { theme } = useTheme()

	const geometry = new BoxGeometry()
	const material = new MeshBasicMaterial({ color: 0x00ff00 })
</script>

<section>
	<Scene sceneId="test" background={new Color($theme.colors.background)}>
		<PerspectiveCamera
			slot="camera"
			fov={70}
			aspect={window.innerWidth / window.innerHeight}
			far={0.1}
			near={1000}
			position={{ z: 5 }}
			animate={{ rotateX: 0 }}
		/>
		<Mesh
			slot="mesh"
			{geometry}
			{material}
			position={{ x: 0 }}
			animate={{
				// rotateY: 0.01,
				// rotateX: 0.01,
				translateX: {
					distance: 0.01,
					limit: 1
				},
				translateZ: {
					distance: 0.01,
					limit: 2.5
				}

			}}
		/>
	</Scene>
</section>

<style>
	section {
		display: flex;
		height: 100%;
		align-items: center;
	}
</style>
