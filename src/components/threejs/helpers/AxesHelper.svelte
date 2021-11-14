<script lang="ts">
	import { sceneStore } from '../../../stores/threejs/scene.store'
	import { AxesHelper } from 'three'

	export let size: number | undefined = undefined

	// TODO: create controller
	const helper = new AxesHelper(size)

	$sceneStore.add(helper)

	console.log({ x: 'red', y: 'green', z: 'blue' })
</script>
