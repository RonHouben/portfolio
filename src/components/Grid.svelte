<script lang="ts">
  import anime from 'animejs'
  import type { Object3D } from 'three'
  import { MeshNormalMaterial } from 'three'
  import { BoxGeometry } from 'three'
  import Group from './threejs/objects/Group.svelte'
  import Mesh from './threejs/objects/Mesh.svelte'
  import PhysicsBody from './cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'

  export let name: string
  export let rows: number
  export let columns: number
  export let depth: number
  export let cellSize: number
  export let cellDistance: number
  export let position:
    | {
        x?: number
        y?: number
        z?: number
      }
    | undefined = undefined

  const rowsArray = new Array(rows)
    .fill(0)
    .map((_, i) => (i === 0 ? i : i * (cellSize + cellDistance)))
  const columnArray = new Array(columns)
    .fill(0)
    .map((_, i) => (i === 0 ? i : i * (cellSize + cellDistance)))
  const depthArray = new Array(depth).fill(0).map((_, i) => cellDistance - i - cellDistance)

  const childrenNames: string[] = rowsArray.flatMap((row) =>
    columnArray.flatMap((column) => depthArray.map((depth) => `x{${column}} y{${row}} z{${depth}}`))
  )

</script>

<Group options={{ name, childrenNames, position }}>
  {#each rowsArray as row}
    {#each columnArray as column}
      {#each depthArray as depth}
        <PhysicsBody
          options={{
            type: CANNON.Body.DYNAMIC,
            position: new CANNON.Vec3(column, row, depth),
            mass: 1,
            shape: new CANNON.Box(new CANNON.Vec3(cellSize, cellSize, cellSize))
          }}
        >
          <Mesh
            options={{
              name: `x{${column}} y{${row}} z{${depth}}`,
              geometry: new BoxGeometry(cellSize, cellSize, cellSize),
              material: new MeshNormalMaterial({
                opacity: 1,
              }),
              position: {
                x: column,
                y: row,
                z: depth
              }
            }}
            onClick={({ target }) => {
              target.material.wireframe = !target.material.wireframe
            }}
          />
        </PhysicsBody>
      {/each}
    {/each}
  {/each}
</Group>
