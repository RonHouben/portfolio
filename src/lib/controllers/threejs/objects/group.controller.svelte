<script lang="ts" context="module">
  import type {
    AnimateFunction,
    BaseControllerOptions
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
import type { Vector3 } from '$lib/utils/math/vector3.svelte';
  import type { Modify } from '$lib/utils/types'
  import { Group } from 'three'

  export interface GroupControllerOptions
    extends Modify<
      BaseControllerOptions<Group>,
      { position?: Vector3 }
    > {
    childrenNames: string[]
  }
  export type GroupInitOptions = GroupControllerOptions
  export type GroupUpdateOptions = GroupControllerOptions
  export type GroupAnimateFunction = AnimateFunction<Group>

  export class GroupController extends BaseController<Group> {
    public three: Group
    protected interactable: Group

    constructor(options: GroupControllerOptions) {
      super(options)

      this.three = new Group()
      this.three.name = options.name
      this.interactable = this.three

      this.scene.add(this.three)

      this.init(options)
    }

    protected override init(options: GroupInitOptions): void {
      console.log(options.position)
      this.setPosition(options.position)

      setInterval(() => {
        this.addChildren(options.childrenNames)
      })
    }

    private addChildren(childrenNames: GroupInitOptions['childrenNames']): void {
      for (const name of childrenNames) {
        this.add(name)
      }
    }

    private add(name: string): void {
      const object = this.scene.getObjectByName(name)

      if (!object) {
        throw new Error(`Unable to find object with name: ${name}`)
      }

      this.three.add(object)
    }

    public override animate(animateFunction: GroupAnimateFunction): void {
      if (animateFunction) {
        requestAnimationFrame(() => this.animate(animateFunction))

        animateFunction(this.three, this.scene)
      }
    }

    public override updateOptions(options: GroupUpdateOptions): void {
      this.setPosition(options.position)
    }
  }
</script>
