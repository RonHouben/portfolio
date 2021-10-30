<script lang="ts">
	import { onMount } from 'svelte'
	import type { Color, Texture } from 'three'
	import { Scene, WebGLRenderer } from 'three'
	import { perspectiveCamera } from '../../stores/threejs/perspective.camera.store'
	import { scene } from '../../stores/threejs/scene.store'

	export let sceneId: string
	export let height: number = 0
	export let width: number = 0
	export let background: Color | Texture

	// set the scene store value to a new scene
	scene.set(new Scene())

	// set the scenes properties
	$: $scene.background = background

	// create a new renderen
	const renderer = new WebGLRenderer()

	// resize the renderer if the width || height change
	$: renderer.setSize(width, height)

	onMount(() => {
		const sceneElement = document.getElementById(sceneId)

		if (!sceneElement) {
			console.error(`Couldn't find element with id ${sceneId}`)
		} else {
			// add renderer to the DOM
			sceneElement.appendChild(renderer.domElement)

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
	}
</script>

<div id={sceneId}>
	<slot name="light" />
	<slot name="camera">
		<!-- TODO: Create errorMessage component -->
		<p>
			Make sure to add a Camera component as a child! Did you forget to add the property
			`slot="camera"` to the Camera component?
		</p>
	</slot>
	<slot name="mesh" />
</div>
