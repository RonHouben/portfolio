<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { MeshPhongMaterial } from 'three'
  import PhysicsBody from '../cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'
  import { CylinderGeometry } from 'three'
  import { GameController } from '$lib/controllers/game/game.controller.svelte';
  import { TargetLocationController } from '$lib/controllers/game/targetLocation.controller.svelte';

  export let name: string
  export let targetName: string
</script>

<PhysicsBody
  options={{
    name,
    type: CANNON.Body.DYNAMIC,
    shape: new CANNON.Cylinder(0.5, 0.5, 0.125),
    mass: 0,
    position: new CANNON.Vec3(0, 0, 50),
    isTrigger: true,
    onTrigger: async (event) => {
      if (event.body && event.body.name === targetName) {
        const targetLocation = new TargetLocationController(name)
        // await targetLocation.send('fade-out')
      }
    },
    onTriggerEnd: async (event) => {
      if (event.bodyA && event.bodyA.name === targetName) {
        const gameController = new GameController()
        await gameController.send('stop-moving-player')
      }
    }
  }}
>
  <Mesh
    options={{
      name,
      geometry: new CylinderGeometry(0.5, 0.5, 0.125, 5),
      material: new MeshPhongMaterial({
        color: 'green',
        transparent: true,
        opacity: 1
      }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
    }}
  />
</PhysicsBody>
