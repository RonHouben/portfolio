<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
</script>

<Mesh
  options={{
    name: 'cursor',
    geometry: new BoxGeometry(1, 1),
    material: new MeshPhongMaterial({
      color: 'green',
      visible: false
    }),
    shadow: {
      castShadow: true,
      receiveShadow: true
    }
  }}
/>
