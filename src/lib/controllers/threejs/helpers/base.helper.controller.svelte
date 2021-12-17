<script lang="ts" context="module">
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import { get } from 'svelte/store'
  import type { Scene } from 'three'

  export abstract class BaseHelperController<T> {
    public three!: T
    protected scene: Scene

    constructor() {
      this.scene = get(sceneStore)
    }
  }
</script>
