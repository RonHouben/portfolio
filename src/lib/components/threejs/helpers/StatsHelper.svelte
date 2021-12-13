<script lang="ts">
  import { rendererStore } from '$lib/stores/threejs/renderer.store'
  import Stats from 'stats.js'

  $: if ($rendererStore) {
    const stats = new Stats()
    const parentElement = $rendererStore.domElement.parentElement

    if (parentElement) {
      parentElement.appendChild(stats.dom)

      renderLoop(stats)
    }
  }

  function renderLoop(stats: Stats): void {
    requestAnimationFrame(() => renderLoop(stats))

    stats.update()
  }
</script>
