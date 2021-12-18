<script lang="ts" context="module">
  import { raycasterStore } from '$lib/stores/threejs/raycaster.store.svelte'
  import { MouseHelper, MousePositionInCanvas } from '$lib/utils/MouseHelper.svelte'
  import { get } from 'svelte/store'
  import type { Event, Scene } from 'three'
  import type { Object3D } from 'three'

  export type InteractionFunction<T> = (
    target: T,
    scene: Scene,
    mousePosition: MousePositionInCanvas
  ) => void

  type InteractionState = 'idle' | 'entering' | 'interacting'

  export interface InteractionOptions<T> {
    onClick?: InteractionFunction<T>
    onMouseEnter?: InteractionFunction<T>
    onMouseMove?: InteractionFunction<T>
    onMouseOver?: InteractionFunction<T>
    onMouseLeave?: InteractionFunction<T>
  }

  export class Interactable<T extends Object3D<Event>> {
    public three!: T
    protected scene!: Scene

    private mouseHelper: MouseHelper
    private onClick: InteractionOptions<T>['onClick']
    private onMouseEnter: InteractionOptions<T>['onMouseEnter']
    private onMouseMove: InteractionOptions<T>['onMouseMove']
    private onMouseOver: InteractionOptions<T>['onMouseOver']
    private onMouseLeave: InteractionOptions<T>['onMouseLeave']
    private interactionState: InteractionState

    constructor(options?: InteractionOptions<T>) {
      this.interactionState = 'idle'
      this.mouseHelper = new MouseHelper()

      this.onClick = options?.onClick
      this.onMouseEnter = options?.onMouseEnter
      this.onMouseMove = options?.onMouseMove
      this.onMouseOver = options?.onMouseOver
      this.onMouseLeave = options?.onMouseLeave

      this.addEventListeners()
    }

    private addEventListeners(): void {
      // TODO: also implement touch events
      this.addOnClickEventListener(this.onClick)
      this.addOnMouseEnterEventListener(this.onMouseEnter)
      this.addOnMouseMoveEventListener(this.onMouseMove)
      this.addOnMouseOverEventListener(this.onMouseOver)
      this.addOnMouseLeaveEventListener(this.onMouseLeave)
    }

    private addOnMouseEnterEventListener(onMouseEnter: InteractionOptions<T>['onMouseEnter']): void {
      addEventListener('mousemove', () => {
        const mousePosition = this.mouseHelper.getMousePositionInCanvas()

        if (this.isIntersected() && this.interactionState === 'idle') {
          this.setInteractionState('interacting')

          if (onMouseEnter) {
            onMouseEnter(this.three, this.scene, mousePosition)
          }
        }
      })
    }

    private addOnClickEventListener(onClick: InteractionOptions<T>['onClick']): void {
      addEventListener('click', () => {
        const mousePosition = this.mouseHelper.getMousePositionInCanvas()

        if (this.isIntersected()) {
          this.setInteractionState('interacting')

          if (onClick) {
            onClick(this.three, this.scene, mousePosition)
          }
        }
      })
    }

    private addOnMouseMoveEventListener(onMouseMove: InteractionOptions<T>['onMouseMove']): void {
      addEventListener('mousemove', () => {
        const mousePosition = this.mouseHelper.getMousePositionInCanvas()

        if (onMouseMove) {
          onMouseMove(this.three, this.scene, mousePosition)
        }
      })
    }

    private addOnMouseOverEventListener(onMouseOver: InteractionOptions<T>['onMouseOver']): void {
      addEventListener('mousemove', () => {
        const mousePosition = this.mouseHelper.getMousePositionInCanvas()

        if (this.isIntersected()) {
          this.setInteractionState('interacting')

          if (onMouseOver) {
            onMouseOver(this.three, this.scene, mousePosition)
          }
        }
      })
    }

    private addOnMouseLeaveEventListener(
      onMouseLeave: InteractionOptions<T>['onMouseLeave']
    ): void {
      addEventListener('mousemove', () => {
        const mousePosition = this.mouseHelper.getMousePositionInCanvas()

        if (!this.isIntersected() && this.interactionState === 'interacting') {
          this.setInteractionState('idle')

          if (onMouseLeave) {
            onMouseLeave(this.three, this.scene, mousePosition)
          }
        }
      })
    }

    private setInteractionState(newState: InteractionState): void {
      this.interactionState = newState
    }

    private isIntersected(): boolean {
      const { intersects } = get(raycasterStore)

      return !!intersects.find(({ object }) => object.uuid === this.three.uuid)
    }
  }
</script>
