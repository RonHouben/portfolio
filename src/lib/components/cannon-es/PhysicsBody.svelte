<script lang="ts">
  import { BodyController } from '$lib/controllers/cannon-es/body.controller'
  import { MouseHelper } from '$lib/threejs/MouseHelper'
  import type { Body, BodyOptions, World } from 'cannon-es'
  import { getContext, onMount } from 'svelte'

  export let options: BodyOptions & { rotation?: { x?: number; y?: number; z?: number } }
  export let onMousemove: OnMousemove | undefined = undefined
  export let onClick: OnMouseclick | undefined = undefined

  interface PhysicsMouseEvent {
    target: Body
    mousePosition: {
      x: number
      y: number
    }
  }

  type OnMousemove = (event: PhysicsMouseEvent) => void
  type OnMouseclick = (event: PhysicsMouseEvent) => void

  const world = getContext<World>('world')
  const bodyController = new BodyController(world, options)

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
