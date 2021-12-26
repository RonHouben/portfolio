<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { BoxGeometry, DoubleSide, MeshPhongMaterial } from 'three'

</script>

<Mesh
  options={{
    name: 'cursor',
    geometry: new BoxGeometry(1, 1),
    material: new MeshPhongMaterial({
      color: 'green',
      side: DoubleSide
    }),
    position: {
      x: 2,
      y: 0,
      z: 0
    }
  }}
/>
