import { writable } from 'svelte/store'
import type { RaycasterController } from '../../controllers/threejs/raycaster.controller'

export const raycasterStore = writable<RaycasterController>()
