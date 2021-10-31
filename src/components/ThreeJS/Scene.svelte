<script lang="ts">
	import { onMount } from 'svelte'
	import type { Color, Texture } from 'three'
	import { Scene, WebGLRenderer } from 'three'
	import { perspectiveCamera } from '../../stores/threejs/perspective.camera.store'
	import { scene } from '../../stores/threejs/scene.store'
	import Stats from 'three/examples/jsm/libs/stats.module'
	import { AxesHelper } from 'three'
	import { GridHelper } from 'three'

	export let sceneId: string
	export let height: number = 0
	export let width: number = 0
	export let background: Color | Texture
	export let showStats: boolean = false
	export let showAxesHelper: boolean = false
	export let showGridHelper: boolean = false

	// set the scene store value to a new scene
	scene.set(new Scene())

	const stats = Stats()

	// set the scenes properties
	$: $scene.background = background

	// set helpers
	if (showAxesHelper) {
		const axesHelper = new AxesHelper(5)
		$scene.add(axesHelper)
	}

	if (showGridHelper) {
		const gridHelper = new GridHelper()
		$scene.add(gridHelper)
	}

	// create a new renderen
	const renderer = new WebGLRenderer()

	// resize the renderer if the width || height change
	$: renderer.setSize(width, height)
	renderer.shadowMap.enabled = true

	onMount(() => {
		const sceneElement = document.getElementById(sceneId)

		if (!sceneElement) {
			console.error(`Couldn't find element with id ${sceneId}`)
		} else {
			// add renderer to the DOM
			sceneElement.appendChild(renderer.domElement)

			if (showStats) {
				sceneElement.appendChild(stats.dom)
			}

			// set height && width based on the parentsElement
			// if the width || height is not given as a prop to the Scene component
			const parentElement = sceneElement.parentElement as HTMLElement

			if (!height) {
				height = parentElement.offsetHeight
			}
			if (!width) {
				width = parentElement.offsetWidth
			}
		}
	})

	// only run the animation loop if there's a scene and camera
	// BUG: animate function should only be called once!
	// currently it keeps calling it when you toggle the theme which fastens the spinning of the cube
	$: if ($scene && $perspectiveCamera) {
		animate()
	}

	// animate()

	// animation loop function
	function animate() {
		requestAnimationFrame(animate)
		// TODO: use orbit controls to move the camera
		renderer.render($scene, $perspectiveCamera)

		stats.update()
	}
</script>

<div id={sceneId}>
	<slot name="lights" />
	<slot name="camera">
		<!-- TODO: Create errorMessage component -->
		<p>
			Make sure to add a Camera component as a child! Did you forget to add the property
			`slot="camera"` to the Camera component?
		</p>
	</slot>
	<slot name="meshes" />
</div>
