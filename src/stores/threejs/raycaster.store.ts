import { writable } from 'svelte/store'
import type { RaycasterController } from '../../controllers/threejs/raycaster.controller'

export const raycasterIntersectsStore = writable<RaycasterController['intersects']>([])
