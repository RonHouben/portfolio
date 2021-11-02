<script lang="ts">
	import { scene } from '../../stores/threejs/scene.store'
	import { AxesHelper, Scene } from 'three'
	import { GridHelper } from 'three'
	import Stats from 'three/examples/jsm/libs/stats.module'
	import { renderer } from '../../stores/threejs/renderer.store'
	import type { Renderer } from 'three'
	import { DirectionalLightHelper } from 'three'
	import type { DirectionalLight } from 'three'

	export let options: DebugOptions
	interface DebugOptions {
		showAxesHelper?: boolean
		showGridHelper?: boolean
		showFPS?: boolean
		directionalLights: LightDebugState[]
	}

	interface LightDebugState {
		name: string
		showHelper: boolean
	}

	interface DirectionalLightHelperState {
		[name: string]: DirectionalLightHelper
	}


	const axesHelper = new AxesHelper(10)
	const gridHelper = new GridHelper()
	const fpsStats = Stats()
	let directionalLightHelpersState: DirectionalLightHelperState = {}

	$: setHelpers($renderer, $scene, options)

	// add/remove helpers from scene
	function setHelpers(renderer: Renderer, scene: Scene | undefined, options: DebugOptions): void {
		if (scene) {
			// showAxesHelper
			if (options.showAxesHelper) {
				scene.add(axesHelper)
			} else {
				scene.remove(axesHelper)
			}

			// showGridHelper
			if (options.showGridHelper) {
				scene.add(gridHelper)
			} else {
				scene.remove(gridHelper)
			}

			// showFPS
			// setTimeout is a workaround to wait for the parentElement to be loaded
			setTimeout(() => {
				const parentElement = renderer.domElement.parentElement

				if (options.showFPS) {
					if (parentElement) {
						parentElement.appendChild(fpsStats.dom)

						const updateFPS = () => {
							requestAnimationFrame(updateFPS)
							fpsStats.update()
						}
						updateFPS()
					}
				} else if (parentElement && parentElement.contains(fpsStats.dom)) {
					parentElement.removeChild(fpsStats.dom)
				}
			}, 0)

			// directionLights
			for (const { name, showHelper } of options.directionalLights) {
				const light = scene.getObjectByName(name) as DirectionalLight | undefined

				if (!directionalLightHelpersState[name] && light && showHelper) {
					directionalLightHelpersState[name] = new DirectionalLightHelper(light)

					scene.add(directionalLightHelpersState[name])
				} else if (directionalLightHelpersState[name] && !showHelper) {
					scene.remove(directionalLightHelpersState[name])

					delete directionalLightHelpersState[name]
				}
			}
		}
	}
</script>

<div id="debug-panel">
	<p><strong>DEBUG PANEL</strong></p>
	<div id="items">
		{#each Object.entries(options) as [key, val]}
			{#if typeof val === 'boolean'}
				<label>{key}: <input type="checkbox" bind:checked={options[key]} /></label>
			{/if}
			{#if key === 'directionalLights'}
				{#each val as directionLight}
					<label
						>{directionLight.name}:
						<input type="checkbox" bind:checked={directionLight.showHelper} /></label
					>
				{/each}
			{/if}
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
