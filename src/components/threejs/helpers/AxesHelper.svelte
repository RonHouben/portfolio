<script lang="ts">
  import {
    AxesHelperController,
    AxesHelperControllerOptions
  } from '../../../controllers/threejs/helpers/axes.helper.controller'

  export let options: AxesHelperControllerOptions

  new AxesHelperController(options)

  console.log({ x: 'red', y: 'green', z: 'blue' })
</script>
