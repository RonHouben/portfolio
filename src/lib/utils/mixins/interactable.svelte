<script lang="ts" context="module">
  import type { MeshController } from '$lib/controllers/threejs/objects/mesh.controller.svelte'

  type Constructor<T> = new (...args: any[]) => T

  export enum InteractionEvent {
    Click = 'click',
    Mousemove = 'mousemove',
    Mouseenter = 'mouseenter',
    Mouseover = 'mouseover',
    Mouseleave = 'mouseleave',
    Touchmove = 'touchmove'
  }

  type ObjectInteractionFunction = (target: unknown) => void

  interface InteractableOptions {
    onClick?: ObjectInteractionFunction
  }

  export function InteractableMesh<T extends Constructor<MeshController>>(BaseClass: T) {
    return class Interactable extends BaseClass {
      private onClick?: InteractableOptions['onClick']

      // constructor(options: InteractableOptions) {
      //   super()

      //   this.onClick = options.onClick

      //   this.addEventListeners()
      // }

      addEventListeners(): void {
        // if (this.onClick) {
        addEventListener('click', () => {
          // this.onClick!('target')
        })
      }
    }
  }
</script>
