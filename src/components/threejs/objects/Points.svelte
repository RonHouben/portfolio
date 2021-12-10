<script lang="ts">
  import type { AnimateFunction } from '../../../controllers/threejs/base.controller'
  import type { Points } from 'three'
  import {
    CreatePointsFunction,
    PointsController,
    PointsControllerOptions
  } from '../../../controllers/threejs/objects/points.controller'
  import { onMount } from 'svelte'

  export let options: PointsControllerOptions
  export let animate: AnimateFunction<Points> | undefined = undefined
  export let createPoints: CreatePointsFunction

  const pointsController = new PointsController(options)

  onMount(() => {
    if (animate) {
      pointsController.animate(animate)
    }

    pointsController.createPoints(createPoints)
  })

  $: pointsController.update(options)
</script>
