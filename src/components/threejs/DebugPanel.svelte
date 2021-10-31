<script lang="ts">
	import { scene } from '../../stores/threejs/scene.store'
	import { AxesHelper } from 'three'
	import { GridHelper } from 'three'

	export let options: DebugOptions

	interface DebugOptions {
		showAxesHelper?: boolean
		showGridHelper?: boolean
		showFPS?: boolean
		[key: string]: boolean | undefined
	}

	const axesHelper = new AxesHelper(10)
	const gridHelper = new GridHelper()

	// set options
	$: if ($scene) {
		if (options.showAxesHelper) {
			$scene.add(axesHelper)
		} else {
			$scene.remove(axesHelper)
		}

		if (options.showGridHelper) {
			$scene.add(gridHelper)
		} else {
			$scene.remove(gridHelper)
		}
	}
</script>

<div id="debug-panel">
	<p><strong>DEBUG PANEL</strong></p>
	<div id="items">
		{#each Object.keys(options) as key}
			<label>{key}: <input type="checkbox" bind:checked={options[key]} /> </label>
		{/each}
	</div>
</div>

<style>
	#debug-panel {
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 9999;

		background: orange;
		padding: var(--theme-spacing-padding-sm);
	}

	#items {
		display: flex;
		flex-direction: column;
	}

	label {
		margin: var(--theme-spacing-margin-sm);
	}
</style>
