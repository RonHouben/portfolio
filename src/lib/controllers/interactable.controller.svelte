<script lang="ts" context="module">
  import type { PhysicsBody } from '$lib/controllers/cannon-es/body.controller.svelte'
  import type { ThreeJSObject } from '$lib/controllers/threejs/base.controller.svelte'
  import { physicsBodyStore } from '$lib/stores/cannon-es/body.store.svelte'
  import { physicsWorldStore } from '$lib/stores/cannon-es/world.store.svelte'
  import { raycasterStore } from '$lib/stores/threejs/raycaster.store.svelte'
  import { sceneStore } from '$lib/stores/threejs/scene.store.svelte'
  import type { World } from 'cannon-es'
  import { get } from 'svelte/store'
  import type { Intersection, Scene } from 'three'
  import type { PhysicsWorld } from './cannon-es/world.controller.svelte'
  import type { ThreeJSScene } from './threejs/objects/scene.controller.svelte'

  export type InteractionFunction<T extends ThreeJSObject> = (options: {
    target: T
    intersections: Intersection<T>[]
    physicsBody?: PhysicsBody
    scene?: Scene
    physicsWorld?: PhysicsWorld
  }) => void | Promise<void>

  type InteractionState = 'idle' | 'entering' | 'interacting'

  export interface InteractionOptions<T extends ThreeJSObject> {
    onClick?: InteractionFunction<T>
    onMouseEnter?: InteractionFunction<T>
    onMouseMove?: InteractionFunction<T>
    onMouseOver?: InteractionFunction<T>
    onMouseLeave?: InteractionFunction<T>
  }

  export interface CannonJSWorld extends World {}
  export interface CannonJSBody extends PhysicsBody {}

  export abstract class Interactable<T extends ThreeJSObject> {
    protected abstract interactable: T

    private onClick: InteractionOptions<T>['onClick']
    private onMouseEnter: InteractionOptions<T>['onMouseEnter']
    private onMouseMove: InteractionOptions<T>['onMouseMove']
    private onMouseOver: InteractionOptions<T>['onMouseOver']
    private onMouseLeave: InteractionOptions<T>['onMouseLeave']
    private interactionState: InteractionState

    constructor(options?: InteractionOptions<T>) {
      this.interactionState = 'idle'

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
          const intersection = this.getIntersectionById(this.interactable.uuid)

          if (intersection && this.interactionState === 'idle') {
            this.setInteractionState('interacting')

            onMouseEnter({
              target: this.interactable,
              intersections: [intersection],
              physicsBody: this.getPhysicsBody(),
              physicsWorld: this.getPhysicsWorld(),
              scene: this.getScene()
            })
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
      }
    }

    private addOnClickEventListener(onClick: InteractionOptions<T>['onClick']): void {
      if (onClick) {
        const handleEvent = (): void => {
          // const intersection = this.getIntersectionById(this.interactable.uuid)
          const intersections = this.getIntersections()

          if (intersections) {
            this.setInteractionState('interacting')

            onClick({
              target: this.interactable,
              intersections,
              physicsBody: this.getPhysicsBody(),
              physicsWorld: this.getPhysicsWorld(),
              scene: this.getScene()
            })
          }
        }

        addEventListener('click', handleEvent)
        addEventListener('touchstart', handleEvent)
      }
    }

    private addOnMouseMoveEventListener(onMouseMove: InteractionOptions<T>['onMouseMove']): void {
      if (onMouseMove) {
        const handleEvent = (): void => {
          const intersections = this.getIntersections()

          onMouseMove({
            target: this.interactable,
            intersections,
            scene: this.getScene(),
            physicsBody: this.getPhysicsBody(),
            physicsWorld: this.getPhysicsWorld()
          })
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
      }
    }

    private addOnMouseOverEventListener(onMouseOver: InteractionOptions<T>['onMouseOver']): void {
      if (onMouseOver) {
        const handleEvent = (): void => {
          const intersection = this.getIntersectionById(this.interactable.uuid)

          if (intersection) {
            this.setInteractionState('interacting')

            onMouseOver({
              target: this.interactable,
              intersections: [intersection],
              physicsBody: this.getPhysicsBody(),
              physicsWorld: this.getPhysicsWorld(),
              scene: this.getScene()
            })
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
          const intersection = this.getIntersectionById(this.interactable.uuid)

          if (!intersection && this.interactionState === 'interacting') {
            this.setInteractionState('idle')

            onMouseLeave({
              target: this.interactable,
              intersections: intersection ? [intersection] : [],
              physicsBody: this.getPhysicsBody(),
              physicsWorld: this.getPhysicsWorld(),
              scene: this.getScene()
            })
          }
        }

        addEventListener('mousemove', handleEvent)
        addEventListener('touchmove', handleEvent)
        addEventListener('touchend', handleEvent)
      }
    }

    private getScene(): ThreeJSScene | undefined {
      return get(sceneStore)
    }

    protected getPhysicsBody(): PhysicsBody | undefined {
      return get(physicsBodyStore)
    }

    private getPhysicsWorld(): PhysicsWorld {
      return get(physicsWorldStore)
    }

    private setInteractionState(newState: InteractionState): void {
      this.interactionState = newState
    }

    private getIntersections(): Intersection<T>[] {
      const raycaster = get(raycasterStore)
      return raycaster && (raycaster.intersects as unknown as Intersection<T>[]) || []
    }

    private getIntersectionById(id: string): Intersection<T> | undefined {
      const raycaster = get(raycasterStore)

      if (raycaster && raycaster.intersects) {
        return raycaster.intersects.find(({ object }) => object.uuid === id) as
          | Intersection<T>
          | undefined
      }
    }
  }
</script>
