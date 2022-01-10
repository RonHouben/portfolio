<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
  import PhysicsBody from '../cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'
  import TargetLocation from './TargetLocation.svelte';
</script>

<PhysicsBody
  options={{
    name: 'player-physics',
    type: CANNON.Body.KINEMATIC,
    shape: new CANNON.Box(new CANNON.Vec3(0.5, 1, 0.5)),
    materialName: 'bouncy',
    position: new CANNON.Vec3(0, 1, 0),
    mass: 1,
    appendMeshPosition: true
  }}
>
  <Mesh
    options={{
      name: 'player',
      geometry: new BoxGeometry(1, 2, 1),
      material: new MeshPhongMaterial({ color: 'yellow' }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
</PhysicsBody>

<TargetLocation name='player-target-location' targetName='player-physics' />