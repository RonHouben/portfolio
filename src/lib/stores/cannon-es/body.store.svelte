<script lang="ts" context="module">
  import type { PhysicsBody } from '$lib/controllers/cannon-es/body.controller.svelte'
  import { writable } from 'svelte/store'

  export const physicsBodyStore = writable<PhysicsBody>()
</script>
