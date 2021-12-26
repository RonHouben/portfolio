<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import * as CANNON from 'cannon-es'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
</script>

<PhysicsBody
  options={{
    name: 'player',
    type: CANNON.Body.KINEMATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
    position: new CANNON.Vec3(0, 1, 0),
    mass: 1
    // velocity: new CANNON.Vec3(0.1, 0, 0),
  }}
>
  <Mesh
    options={{
      name: 'player',
      geometry: new BoxGeometry(1.5, 2, 1),
      material: new MeshPhongMaterial({ color: 'yellow' }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
</PhysicsBody>
