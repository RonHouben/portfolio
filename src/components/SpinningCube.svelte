<script lang="ts">
	import {
		AmbientLight,
		BoxBufferGeometry,
		Canvas,
		DirectionalLight,
		DoubleSide,
		MathUtils,
		Mesh,
		MeshStandardMaterial,
		OrbitControls,
		PCFSoftShadowMap,
		PerspectiveCamera,
		PlaneBufferGeometry,
		Scene,
		WebGLRenderer
	} from 'svelthree';
	import { getContext } from 'svelte';
import type { ThemeContext } from 'src/contexts/types';

	const { theme } = getContext<ThemeContext>('theme');

	const cubeGeometry = new BoxBufferGeometry(1, 1, 1);
	const cubeMaterial = new MeshStandardMaterial();

	const floorGeometry = new PlaneBufferGeometry(10, 10, 1);
	const floorMaterial = new MeshStandardMaterial();
</script>

<Canvas let:sti w={window.innerWidth} h={window.innerHeight}>
	<Scene {sti} let:scene id="scene1" props={{ background: $theme.colors.background }}>
		<PerspectiveCamera {scene} id="cam1" pos={[0, 0, 6]} lookAt={[0, 0, 0]} />
		<AmbientLight {scene} intensity={1.25} />
		<DirectionalLight {scene} pos={[1, 2, 1]} intensity={0.8} shadowMapSize={512 * 8} castShadow />

		<Mesh
			{scene}
			geometry={cubeGeometry}
			material={cubeMaterial}
			mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
			pos={[0, 0, 0]}
			rot={[0, 0, 0]}
			castShadow
			receiveShadow
		/>

		<Mesh
			{scene}
			geometry={floorGeometry}
			material={floorMaterial}
			mat={{ roughness: 0.5, metalness: 0.5, side: DoubleSide, color: $theme.colors.background }}
			pos={[0, -0.501, 0]}
			rot={[MathUtils.degToRad(-90), 0, 0]}
			scale={[1, 1, 1]}
			receiveShadow
		/>

		<OrbitControls {scene} autoRotate enableDamping />
	</Scene>

	<WebGLRenderer
		{sti}
		sceneId="scene1"
		camId="cam1"
		config={{ antialias: true, alpha: true }}
		enableShadowMap
		shadowMapType={PCFSoftShadowMap}
	/>
</Canvas>
