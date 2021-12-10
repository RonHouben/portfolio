<script lang="ts">
  import { GridHelper } from '$lib/threejs/GridHelper'
  import anime from 'animejs'
  import type { Object3D } from 'three'
  import { MeshNormalMaterial } from 'three'
  import { BoxGeometry } from 'three'
  import Group from './threejs/objects/Group.svelte'
  import Mesh from './threejs/objects/Mesh.svelte'

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

  const animateGridItem = (target: Object3D, position: { y?: number; x?: number; z?: number }) => {
    anime({
      easings: 'spring(1, 20, 10, 0)',
      targets: target.position,
      x: position.x,
      y: position.y,
      z: position.z
    })
  }
</script>

<Group options={{ name, childrenNames, position }}>
  {#each rowsArray as row}
    {#each columnArray as column}
      {#each depthArray as depth}
        <Mesh
          options={{
            name: `x{${column}} y{${row}} z{${depth}}`,
            geometry: new BoxGeometry(cellSize, cellSize, cellSize),
            material: new MeshNormalMaterial({
              // color: '#049ef4',
              depthTest: true,
              depthWrite: true,
              opacity: 1
              // roughness: 0,
              // metalness: 1
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
          onMouseenter={({ target }) => {
            anime({
              easings: 'spring(1, 20, 10, 0)',
              targets: target.position,
              z: -(cellDistance + cellSize)
            })
          }}
          onMouseleave={({ target, scene }) => {
            anime({
              easings: 'spring(1, 20, 10, 0)',
              targets: target.position,
              z: +cellDistance
            })

            const group = scene.getObjectByName(name)

            if (group) {
              const neighbours = GridHelper.getNeighboursOfTarget(
                group,
                target,
                cellDistance,
                cellSize
              )

              for (const neighbour of Object.values(neighbours)) {
                if (neighbour) {
                  animateGridItem(neighbour, { z: cellDistance })
                }
              }
            }
          }}
        />
      {/each}
    {/each}
  {/each}
</Group>
