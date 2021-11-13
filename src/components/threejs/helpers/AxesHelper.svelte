<script lang="ts">
	import { scene } from '../../../stores/threejs/scene.store'
	import { AxesHelper } from 'three'

	export let size: number | undefined = undefined

	const helper = new AxesHelper(size)

	$scene.add(helper)

	console.log({ x: 'red', y: 'green', z: 'blue' })
</script>
