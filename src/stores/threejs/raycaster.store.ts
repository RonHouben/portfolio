import { writable } from 'svelte/store'
import type { RaycasterController } from '../../controllers/threejs/raycaster.controller'

export const raycasterStore = writable<RaycasterController>({
	intersects: [] // workaround to have the intersects array defined on first render
} as unknown as RaycasterController)
