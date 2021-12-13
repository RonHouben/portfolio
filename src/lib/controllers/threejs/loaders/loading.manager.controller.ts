import { loadingManagerStore } from '$lib/stores/threejs/loading.manager.store'
import { LoadingManager } from 'three'

export class LoadingManagerController {
  public three: LoadingManager

  constructor() {
    this.three = new LoadingManager()

    this.init()

    loadingManagerStore.set({
      manager: this.three,
      isLoading: false,
      hasError: false
    })
  }

  private init(): void {
    this.three.onStart = (_url, loaded, total): void => {
      loadingManagerStore.update((prevStore) => ({ ...prevStore, loaded, total, isLoading: true }))
    }

    this.three.onLoad = (): void => {
      loadingManagerStore.update((prevStore) => ({ ...prevStore, isLoading: false }))
    }

    this.three.onProgress = (_url, loaded, total): void => {
      loadingManagerStore.update((prevStore) => ({ ...prevStore, loaded, total, isLoading: true }))
    }

    this.three.onError = (): void => {
      loadingManagerStore.update((prevStore) => ({
        ...prevStore,
        isLoading: false,
        hasError: true
      }))
    }
  }
}
