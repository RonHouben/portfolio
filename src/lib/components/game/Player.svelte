<script lang="ts">
import PhysicsBody from "$lib/components/cannon-es/PhysicsBody.svelte";
import * as CANNON from 'cannon-es'
import Mesh from "$lib/components/threejs/objects/Mesh.svelte";
import { BoxGeometry } from "three";
import { MeshPhongMaterial } from "three";
</script>

<PhysicsBody
  options={{
    name: 'player',
    type: CANNON.Body.KINEMATIC,
    // materialName: 'bouncy',
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
    position: new CANNON.Vec3(0, 1, 0),
    mass: 1,
    // velocity: new CANNON.Vec3(0.1, 0, 0),
  }}
>
  <Mesh
    options={{
      name: 'player',
      geometry: new BoxGeometry(1.5, 2, 1),
      material: new MeshPhongMaterial({
        color: 'blue'
        // opacity: 0.5,
        // transparent: true,
        // clearcoat: 1,
        // metalness: 1,
        // roughness: 0.5
      }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
</PhysicsBody>
