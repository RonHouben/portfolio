<script lang="ts">
  import { rendererStore } from '../../../stores/threejs/renderer.store'
  import Stats from 'stats.js'

  $: if ($rendererStore) {
    const stats = new Stats()

    $rendererStore.domElement.parentElement!.appendChild(stats.dom)

		function renderLoop(): void {
			requestAnimationFrame(renderLoop)

			stats.update()
		}

		renderLoop()
  }
</script>
