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
		directionalLights?: LightDebugState[]
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
				console.info('AxesHelper line colors:', { x: 'red', y: 'green', z: 'blue' })
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
			if (options.directionalLights) {
				for (const { name, showHelper } of options.directionalLights) {
					const light = scene.getObjectByName(name) as DirectionalLight | undefined

					if (!directionalLightHelpersState[name] && light && showHelper) {
						directionalLightHelpersState[name] = new DirectionalLightHelper(light, 2)

						scene.add(directionalLightHelpersState[name])
					} else if (directionalLightHelpersState[name] && !showHelper) {
						scene.remove(directionalLightHelpersState[name])

						delete directionalLightHelpersState[name]
					}
				}
			}
		}
	}
</script>

<div id="debug-panel">
	<p><strong>DEBUG PANEL</strong></p>
	<form>
		{#each Object.entries(options) as [key, val]}
			<!-- directionalLights -->
			{#if key === 'directionalLights'}
				{#each val as directionLight}
					<label for={directionLight.name}>{directionLight.name}</label>
					<input
						id={directionLight.name}
						type="checkbox"
						bind:checked={directionLight.showHelper}
					/>
				{/each}
			{/if}

			<!-- other -->
			{#if typeof val === 'boolean'}
				<label for={key}>{key}</label>
				<input id={key} type="checkbox" bind:checked={options[key]} />
			{/if}
		{/each}
	</form>
</div>

<style>
	#debug-panel {
		display: flex;
		flex-direction: column;
		position: absolute;
		top: 50%;
		right: 0;
		z-index: 9999;

		width: 20%;

		background: orange;
		padding: var(--theme-spacing-padding-sm);
	}

	form {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	label {
		margin: var(--theme-spacing-margin-sm);
	}
</style>
