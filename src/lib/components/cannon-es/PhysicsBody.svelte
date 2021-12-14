<script lang="ts">
  import { BodyController,BodyControllerOptions } from '$lib/controllers/cannon-es/body.controller'
  import { MouseHelper } from '$lib/utils/MouseHelper'
  import type * as CANNON from 'cannon-es'
  import { onMount } from 'svelte'

  export let options: BodyControllerOptions
  export let onMousemove: OnMousemove | undefined = undefined
  export let onClick: OnMouseclick | undefined = undefined

  interface PhysicsMouseEvent {
    target: CANNON.Body
    mousePosition: {
      x: number
      y: number
    }
  }

  type OnMousemove = (event: PhysicsMouseEvent) => void
  type OnMouseclick = (event: PhysicsMouseEvent) => void

  const bodyController = new BodyController(options)

  onMount(() => {
    const mouseHelper = new MouseHelper()

    if (onMousemove) {
      addEventListener('mousemove', () => {
        if (onMousemove) {
          const mousePosition = mouseHelper.getMousePositionInCanvas()

          onMousemove({ target: bodyController.cannon, mousePosition })
        }
      })
    }

    if (onClick) {
      addEventListener('click', () => {
        if (onClick) {
          const mousePosition = mouseHelper.getMousePositionInCanvas()

          onClick({ target: bodyController.cannon, mousePosition })
        }
      })
    }
  })
</script>

<slot />
