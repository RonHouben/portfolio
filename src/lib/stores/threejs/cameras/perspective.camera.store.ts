import { writable } from 'svelte/store'
import type { PerspectiveCamera } from 'three'

export const cameraStore = writable<PerspectiveCamera>()
