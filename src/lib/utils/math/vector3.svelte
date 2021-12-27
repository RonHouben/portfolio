<script lang="ts" context="module">
  export interface Vector3 {
    x?: number
    y?: number
    z?: number
  }

  export function isVector3(vector: unknown): vector is Vector3 {
    let x: boolean
    let y: boolean
    let z: boolean

    try {
      x = typeof (vector as Vector3).x === 'number' // || typeof (vector as Vector3).x === undefined
    } catch (error) {
      x = false
    }

    try {
      y = typeof (vector as Vector3).y === 'number' // || typeof (vector as Vector3).y === undefined
    } catch (error) {
      y = false
    }

    try {
      z = typeof (vector as Vector3).z === 'number' // || typeof (vector as Vector3).z === undefined
    } catch (error) {
      z = false
    }

    return x || y || z
  }
</script>
