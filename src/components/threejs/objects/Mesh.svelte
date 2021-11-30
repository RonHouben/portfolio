<script lang="ts">
	import { onMount } from 'svelte'
	import {
		MeshController,
		MeshAnimateFunction,
		MeshControllerOptions,
		MouseEventType
	} from '../../../controllers/threejs/objects/mesh.controller'
	import { sceneStore } from '../../../stores/threejs/scene.store'

	export let options: MeshControllerOptions
	export let animate: MeshAnimateFunction | undefined = undefined
	export let onClick: MeshControllerOptions['onClick'] | undefined = undefined
	export let onMousemove: MeshControllerOptions['onMousemove'] | undefined = undefined
	export let onMouseover: MeshControllerOptions['onMouseover'] | undefined = undefined

	let meshController: MeshController

	onMount(() => {
		meshController = new MeshController({ ...options, onClick, onMousemove, onMouseover })

		if (onClick) {
			addEventListener('mousedown', (e) => {
				meshController.three.dispatchEvent({ type: MouseEventType.Click })
			})
		}

		if (onMousemove) {
			addEventListener('mousemove', () => {
				meshController.three.dispatchEvent({ type: MouseEventType.Mousemove })
			})

			addEventListener('touchmove', () => {
				meshController.three.dispatchEvent({ type: MouseEventType.Touchmove })
			})
		}

		if (onMouseover) {
			addEventListener('mousemove', () => {
				meshController.three.dispatchEvent({ type: MouseEventType.Mouseover })
			})

			addEventListener('touchmove', () => {
				meshController.three.dispatchEvent({ type: MouseEventType.Touchmove })
			})
		}
	})


	$: if (animate && meshController) {
		animate(meshController.three, $sceneStore)
	}
</script>
