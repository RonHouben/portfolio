<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
  import Group from '../threejs/objects/Group.svelte'
  import { ConeGeometry } from 'three'
  import PhysicsBody from '../cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'
</script>

<Group
  options={{
    name: 'player-group',
    childrenNames: ['player', 'direction']
  }}
>
  <Mesh
    options={{
      name: 'player',
      geometry: new BoxGeometry(1, 2, 1),
      material: new MeshPhongMaterial({ color: 'yellow' }),
      position: {
        y: 1,
      },
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
  <PhysicsBody
    options={{
      name: 'physics',
      type: CANNON.Body.STATIC,
      shape: new CANNON.Box(new CANNON.Vec3(0.5, 2, 0.5)),
      materialName: 'bouncy',
      position: new CANNON.Vec3(0, 0, 0),
      // mass: 1,
      isTrigger: false,
      onTrigger: (event) => {
        console.log('TRIGGERED', event)
        // event.target?.velocity.setZero()
      },
      onTriggerEnd: (event) => {
        if (event.bodyA !== null && event.bodyA.name === 'cursor') {
          console.log('END', event)
          // event.bodyB?.velocity.setZero()
        }
      }
    }}
  >
</PhysicsBody>
  <Mesh
    options={{
      name: 'direction',
      geometry: new ConeGeometry(0.5, 2),
      material: new MeshPhongMaterial({ color: 'blue' }),
      position: {
        y: 1,
        z: 1
      },
      rotation: {
        x: Math.PI / 4
      },
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
</Group>
