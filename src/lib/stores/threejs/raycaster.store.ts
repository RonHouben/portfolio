import type { RaycasterController } from '$lib/controllers/threejs/raycaster.controller'
import { writable } from 'svelte/store'

interface RaycasterStore {
  intersects: RaycasterController['intersects']
  raycaster: RaycasterController['three']
}

export const raycasterStore = writable<RaycasterStore>()
