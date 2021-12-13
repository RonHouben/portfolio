<script lang="ts">
  import type { AnimateFunction } from '$lib/controllers/threejs/base.controller'
  import {
    CreatePointsFunction,
    PointsController,
    PointsControllerOptions
  } from '$lib/controllers/threejs/objects/points.controller'
  import { onMount } from 'svelte'
  import type { Points } from 'three'

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
