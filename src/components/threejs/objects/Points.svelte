<script lang="ts">
	import type { AnimateFunction } from 'src/controllers/threejs/base.controller'
	import type { Points } from 'three'

	import {
		PointsController,
		PointsControllerOptions
	} from '../../../controllers/threejs/objects/points.controller'

	export let options: PointsControllerOptions
	export let animate: AnimateFunction<Points> | undefined = undefined

	const pointsController = new PointsController(options)

	if (animate) {
		pointsController.animate(animate)
	}

	$: pointsController.update(options)
</script>
