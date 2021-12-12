<script lang="ts">
  import type { Body, BodyOptions, World } from 'cannon-es'
  import { getContext, onMount } from 'svelte'
	import { MouseHelper } from '$lib/threejs/MouseHelper';
  import { BodyController } from '../../controllers/cannon-es/body.controller';

  export let options: BodyOptions & { rotation?: { x?: number; y?: number; z?: number } }
  export let onMousemove: OnMousemove | undefined = undefined

  type OnMousemove = (target: Body, mousePosition: { x: number, y: number }) => void

  const world = getContext<World>('world')
  const bodyController = new BodyController(world, options)

  onMount(() => {
		const mouseHelper = new MouseHelper()

    if (onMousemove) {
			addEventListener('mousemove', () => {

				if (onMousemove){
					const mousePosition = mouseHelper.getMousePositionInCanvas()

      		onMousemove(bodyController.cannon, mousePosition)
				}
			})
    }
  })
</script>

<slot />
