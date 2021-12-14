<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import Group from '$lib/components/threejs/objects/Group.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import * as CANNON from 'cannon-es'
  import { BoxGeometry, MeshNormalMaterial } from 'three'

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
            shape: new CANNON.Box(new CANNON.Vec3(cellSize / 2, cellSize / 2, cellSize / 2)),
            materialName: 'cube'
          }}
        >
          <Mesh
            options={{
              name: `x{${column}} y{${row}} z{${depth}}`,
              geometry: new BoxGeometry(cellSize, cellSize, cellSize),
              material: new MeshNormalMaterial({
                opacity: 1
              }),
              position: {
                x: column,
                y: row,
                z: depth
              }
            }}
          />
        </PhysicsBody>
      {/each}
    {/each}
  {/each}
</Group>
