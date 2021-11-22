<script lang="ts">
	import {
		GLTFLoaderController,
		GLTFLoaderControllerOptions
	} from '../../../controllers/threejs/loaders/GLTF.loader.controller'
	import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'

	export let options: GLTFLoaderControllerOptions

	const loaderController = new GLTFLoaderController(options)

	$: if (!$loadingManagerStore.isLoading) {
		loaderController.playSpecificAnimationClip('floating')
	}
</script>
