<script lang="ts">
  import type { HemisphereLightControllerOptions } from '$lib/controllers/threejs/lights/hemisphere.light.controller'
  import { HemisphereLightController } from '$lib/controllers/threejs/lights/hemisphere.light.controller'

  export let options: HemisphereLightControllerOptions

  const lightController = new HemisphereLightController(options)

  $: lightController.update(options)
</script>
