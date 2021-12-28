<script lang="ts">
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import { MeshBasicMaterial } from 'three'
  import { FrontSide } from 'three'
  import { BoxGeometry, MeshPhongMaterial } from 'three'
  import Group from '../threejs/objects/Group.svelte'
</script>

<Group options={{
  name: 'player',
  childrenNames: ['player-body', 'player-direction-arrow'],
  position: {
    y: 1
  }
}}>
  <Mesh
    options={{
      name: 'player-body',
      geometry: new BoxGeometry(1.5, 2, 1),
      material: new MeshPhongMaterial({ color: 'yellow', side: FrontSide }),
      shadow: {
        castShadow: true,
        receiveShadow: true
      }
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
        z: 0.75
      }
    }}
  />
</Group>
