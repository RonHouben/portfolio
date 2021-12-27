<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import * as CANNON from 'cannon-es'
  import { Vector3 } from 'three'
  import { MeshBasicMaterial } from 'three'
  import { LineBasicMaterial } from 'three'
  import { Line } from 'three'
  import { BufferGeometry } from 'three'
  import { FrontSide } from 'three'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
</script>

<PhysicsBody
  options={{
    name: 'player',
    type: CANNON.Body.KINEMATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
    position: new CANNON.Vec3(0, 1, 0),
    mass: 1,
    appendMeshPosition: true,
    // velocity: new CANNON.Vec3(0.1, 0, 0),
  }}
>
  <Mesh
    options={{
      name: 'player',
      geometry: new BoxGeometry(1.5, 2, 1),
      material: new MeshPhongMaterial({ color: 'yellow', side: FrontSide }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      },
    }}
  />

  <Mesh
    options={{
      name: 'player-direction-arrow',
      geometry: new BoxGeometry(0.25, 0.25, 2.5),
      material: new MeshBasicMaterial({ color: 'blue' }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      },
      position: {
        x: 0,
        y: 0,
        z: 0.75
      }
    }}
  />
</PhysicsBody>
