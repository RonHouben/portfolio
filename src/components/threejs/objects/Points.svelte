<script lang="ts">
	import type { AnimateFunction } from '../../../controllers/threejs/base.controller'
	import type { Points } from 'three'
	import {
		CreatePointsFunction,
		PointsController,
		PointsControllerOptions
	} from '../../../controllers/threejs/objects/points.controller'

	export let options: PointsControllerOptions
	export let animate: AnimateFunction<Points> | undefined = undefined
	export let createPoints: CreatePointsFunction

	const pointsController = new PointsController(options)

	if (animate) {
		pointsController.animate(animate)
	}

	pointsController.createPoints(createPoints)

	$: pointsController.update(options)
</script>
