<script lang="ts">
  import {
    GridHelperController,
    GridHelperControllerOptions
  } from '$lib/controllers/threejs/helpers/grid.helper.controller'

  export let options: GridHelperControllerOptions

  new GridHelperController(options)
</script>
