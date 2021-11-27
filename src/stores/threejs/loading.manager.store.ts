import { writable } from "svelte/store";
import type { LoadingManager } from "three";

interface LoadingManagerStore {
	manager: LoadingManager
	isLoading: boolean
	hasError: boolean
	amountLoaded?: number
	totalToLoad?: number
}

export const loadingManagerStore = writable<LoadingManagerStore>()