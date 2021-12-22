<script lang="ts" context="module">
  import { raycasterStore } from '$lib/stores/threejs/raycaster.store.svelte'
  import { MouseHelper, MousePositionInCanvas } from '$lib/utils/MouseHelper.svelte'
  import { get } from 'svelte/store'
  import type { Event, Scene } from 'three'
  import { Object3D } from 'three'
  import type { PhysicsBody } from './cannon-es/body.controller.svelte'

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

  export interface ThreeJSObject extends Object3D<Event> {}
  export interface CannonJSBody extends PhysicsBody {}

  export class Interactable<T extends ThreeJSObject | CannonJSBody> {
    public three!: T
    public cannon!: T
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
      this.addOnClickEventListener(this.onClick)
      this.addOnMouseEnterEventListener(this.onMouseEnter)
      this.addOnMouseMoveEventListener(this.onMouseMove)
      this.addOnMouseOverEventListener(this.onMouseOver)
      this.addOnMouseLeaveEventListener(this.onMouseLeave)
    }

    private addOnMouseEnterEventListener(
      onMouseEnter: InteractionOptions<T>['onMouseEnter']
    ): void {
      if (onMouseEnter) {
        const handleEvent = (): void => {
          if (this.isIntersected() && this.interactionState === 'idle') {
            const { x, y, z } = this.mouseHelper

            this.setInteractionState('interacting')

            onMouseEnter(this.three, this.scene, { x, y, z })
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
      }
    }

    private addOnClickEventListener(onClick: InteractionOptions<T>['onClick']): void {
      if (onClick) {
        const handleEvent = (): void => {
          if (this.isIntersected()) {
            const { x, y, z } = this.mouseHelper

            this.setInteractionState('interacting')

            onClick(this.three, this.scene, { x, y, z })
          }
        }

        addEventListener('click', handleEvent)
        addEventListener('touchstart', handleEvent)
      }
    }

    private addOnMouseMoveEventListener(onMouseMove: InteractionOptions<T>['onMouseMove']): void {
      if (onMouseMove) {
        const handleEvent = (): void => {
          const { x, y, z } = this.mouseHelper

          if (this.three) {
            onMouseMove(this.three, this.scene, { x, y, z })
          }
          if (this.cannon) {
            onMouseMove(this.cannon, this.scene, { x, y, z })
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
      }
    }

    private addOnMouseOverEventListener(onMouseOver: InteractionOptions<T>['onMouseOver']): void {
      if (onMouseOver) {
        const handleEvent = (): void => {
          if (this.isIntersected()) {
            const { x, y, z } = this.mouseHelper

            this.setInteractionState('interacting')

            onMouseOver(this.three, this.scene, { x, y, z })
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
      }
    }

    private addOnMouseLeaveEventListener(
      onMouseLeave: InteractionOptions<T>['onMouseLeave']
    ): void {
      if (onMouseLeave) {
        const handleEvent = (): void => {
          if (!this.isIntersected() && this.interactionState === 'interacting') {
            const { x, y, z } = this.mouseHelper

            this.setInteractionState('idle')

            if (onMouseLeave) {
              onMouseLeave(this.three, this.scene, { x, y, z })
            }
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
        addEventListener('touchend', handleEvent)
      }
    }

    private setInteractionState(newState: InteractionState): void {
      this.interactionState = newState
    }

    private isIntersected(): boolean {
      if (this.three instanceof Object3D) {
        const raycaster = get(raycasterStore)
        const threeObject = this.three as Object3D

        if (raycaster && raycaster.intersects) {
          return !!raycaster.intersects.find(({ object }) => object.uuid === threeObject.uuid)
        }
      }
      return false
    }
  }
</script>
