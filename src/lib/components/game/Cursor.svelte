<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
  import PhysicsBody from '../cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'
</script>

<PhysicsBody options={{
  name: 'cursor',
  type: CANNON.Body.STATIC,
  shape: new CANNON.Box(new CANNON.Vec3(0.5, 0, 0.5)),
}}>
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
      },
    }}
  />
</PhysicsBody>
