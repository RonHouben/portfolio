<script lang="ts">
  import type { HemisphereLightControllerOptions } from '$lib/controllers/threejs/lights/hemisphere.light.controller.svelte'
  import { HemisphereLightController } from '$lib/controllers/threejs/lights/hemisphere.light.controller.svelte'

  export let options: HemisphereLightControllerOptions

  const lightController = new HemisphereLightController(options)

  $: lightController.update(options)
</script>
