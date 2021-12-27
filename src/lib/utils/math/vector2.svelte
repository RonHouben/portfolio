<script lang="ts" context="module">
  export interface Vector2 {
    x: number
    y: number
  }

  export function isVector2(vector: unknown): vector is Vector2 {
    let x: boolean
    let y: boolean

    try {
      x = typeof (vector as Vector2).x === 'number' // || typeof (vector as Vector3).x === undefined
    } catch (error) {
      x = false
    }

    try {
      y = typeof (vector as Vector2).y === 'number' // || typeof (vector as Vector3).y === undefined
    } catch (error) {
      y = false
    }

    return x || y
  }
</script>
