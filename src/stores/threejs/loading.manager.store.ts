import { writable } from "svelte/store";
import type { LoadingManager } from "three";

interface LoadingManagerStore {
	manager: LoadingManager
	isLoading: boolean
	hasError: boolean
	loaded?: number
	total?: number
}

export const loadingManagerStore = writable<LoadingManagerStore>()