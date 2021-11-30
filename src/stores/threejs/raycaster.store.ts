import { writable } from 'svelte/store'
import type { RaycasterController } from '../../controllers/threejs/raycaster.controller'

interface RaycasterStore {
	intersects: RaycasterController['intersects']
	raycaster: RaycasterController['three']
}

export const raycasterStore = writable<RaycasterStore>()
