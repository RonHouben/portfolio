<script lang="ts">
  import { Body } from 'cannon-es'
  import type { BodyOptions, World } from 'cannon-es'
  import { getContext, onMount, setContext } from 'svelte'
import { MouseHelper } from '$lib/threejs/MouseHelper';

  export let options: BodyOptions & { rotation?: { x?: number; y?: number; z?: number } }
  export let onMousemove: OnMousemove | undefined = undefined

  type OnMousemove = (target: Body, mousePosition: { x: number, y: number }) => void

  const body = new Body(options)

  if (options.rotation) {
    const { x, y, z } = options.rotation
    body.quaternion.setFromEuler(x || 0, y || 0, z || 0)
  }
  const world = getContext<World>('world')

  world.addBody(body)

  setContext<Body>('body', body)

  onMount(() => {
		const mouseHelper = new MouseHelper()

    if (onMousemove) {
			addEventListener('mousemove', () => {

				if (onMousemove){
					const mousePosition = mouseHelper.getMousePositionInCanvas()

      		onMousemove(body, mousePosition)
				}
			})
    }
  })
</script>

<slot />
