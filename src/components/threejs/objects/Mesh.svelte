<script lang="ts">
  import { getContext, onMount } from 'svelte'
  import {
    MeshController,
    MeshAnimateFunction,
    MeshControllerOptions,
    InteractionEvent
  } from '../../../controllers/threejs/objects/mesh.controller'
  import type { Body } from 'cannon-es'

  export let options: MeshControllerOptions
  export let animate: MeshAnimateFunction | undefined = undefined
  export let onClick: MeshControllerOptions['onClick'] | undefined = undefined
  export let onMouseenter: MeshControllerOptions['onMouseenter'] | undefined = undefined
  export let onMousemove: MeshControllerOptions['onMousemove'] | undefined = undefined
  export let onMouseover: MeshControllerOptions['onMouseover'] | undefined = undefined
  export let onMouseleave: MeshControllerOptions['onMouseleave'] | undefined = undefined

  let meshController: MeshController

  onMount(() => {
    meshController = new MeshController({
      ...options,
      onClick,
      onMousemove,
      onMouseover,
      onMouseleave,
      onMouseenter
    })

    if (onClick) {
      addEventListener('mousedown', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Click })
      })
    }

    if (onMouseenter) {
      addEventListener('mousemove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Mouseenter })
      })
    }

    if (onMousemove) {
      addEventListener('mousemove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Mousemove })
      })

      addEventListener('touchmove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Touchmove })
      })
    }

    if (onMouseover) {
      addEventListener('mousemove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Mouseover })
      })

      addEventListener('touchmove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Touchmove })
      })
    }

    if (onMouseleave) {
      addEventListener('mousemove', () => {
        meshController.three.dispatchEvent({ type: InteractionEvent.Mouseleave })
      })
    }
  })

  $: if (animate && meshController) {
    meshController.animate(animate)
  }

  $: body = getContext<Body>('body')

  $: if (meshController && body) {
    meshController.setPositionFromPhysicsBody(body)
  }
</script>
