<script lang="ts">
	import { loadingManagerStore } from '../../../stores/threejs/loading.manager.store'
	import { LoadingManagerController } from '../../../controllers/threejs/loaders/loading.manager.controller'

	export let options: LoadingManagerOptions

	$: ({ loadingScreen, errorScreen } = options)

	interface LoadingManagerOptions {
		loadingScreen: {
			enabled: boolean
			backgroundColor?: string
			fontFamily?: string
		}
		errorScreen: {
			enabled: boolean
			backgroundColor?: string
			fontFamily?: string
		}
	}

	new LoadingManagerController()
</script>

{#if loadingScreen.enabled && $loadingManagerStore.isLoading}
	<slot name="loading-screen">
		<div
			style="background-color: {loadingScreen.backgroundColor}; font-family: {errorScreen.fontFamily}"
		>
			LOADING
		</div>
	</slot>
{/if}

{#if options.errorScreen.enabled && $loadingManagerStore.hasError}
	<slot name="error-screen">
		<div
			style="background-color: {errorScreen.backgroundColor}; font-family: {errorScreen.fontFamily}"
		>
			ERROR
		</div>
	</slot>
{/if}
<slot name="loader" />

<style>
	div {
		position: absolute;
		display: flex;
		justify-content: center;
		align-items: center;

		height: 100%;
		width: 100%;
	}
</style>
