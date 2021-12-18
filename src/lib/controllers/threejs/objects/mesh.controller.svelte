<script lang="ts" context="module">
  import type {
    AnimateFunction,
    BaseControllerOptions,
    BaseInitOptions,
  } from '$lib/controllers/threejs/base.controller.svelte'
  import type { Body } from 'cannon-es'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import type {
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    CylinderGeometry,
    MeshBasicMaterial,
    MeshDepthMaterial,
    MeshNormalMaterial,
    MeshPhongMaterial,
    MeshPhysicalMaterial,
    MeshStandardMaterial,
    PlaneBufferGeometry,
    PlaneGeometry,
    Quaternion,
    Scene,
    SphereGeometry,
    Vector3
  } from 'three'
  import { Mesh as ThreeMesh } from 'three'

  type Mesh = ThreeMesh<MeshGeometry, MeshMaterial>

  export interface MouseEvent {
    mousePosition: {
      x: number
      y: number
    }
    target: Mesh
    scene: Scene
  }

  export interface MeshControllerOptions extends BaseControllerOptions<Mesh> {
    geometry: MeshGeometry
    material: MeshMaterial
  }
  export type MeshAnimateFunction = AnimateFunction<Mesh>
  export type MeshGeometry =
    | BoxGeometry
    | PlaneBufferGeometry
    | PlaneGeometry
    | CylinderGeometry
    | CircleGeometry
    | SphereGeometry
    | BufferGeometry
  export type MeshMaterial =
    | MeshPhysicalMaterial
    | MeshPhongMaterial
    | MeshBasicMaterial
    | MeshDepthMaterial
    | MeshStandardMaterial
    | MeshNormalMaterial

  export interface MeshInitOptions extends BaseInitOptions<Mesh> {
    geometry: MeshControllerOptions['geometry']
    material: MeshControllerOptions['material']
  }
  export type MeshUpdateOptions = Omit<Omit<MeshControllerOptions, 'position'>, 'rotation'>

  export class MeshController extends BaseController<Mesh> {

    constructor(options: MeshControllerOptions) {
      const { name,  interactions } = options
      super({ name, interactions })

      this.init(options)
    }

    protected override init(options: MeshInitOptions): void {
      this.three = new ThreeMesh(options.geometry, options.material)
      this.three.name = options.name

      this.setGeometry(options.geometry)
      this.setMaterial(options.material)
      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setShadow(options.shadow)

      this.scene.add(this.three)
    }

    public override update(options: MeshUpdateOptions): void {
      this.setShadow(options.shadow)
      this.setMaterial(options.material)
      this.setGeometry(options.geometry)
    }

    public override animate(animateFunction: AnimateFunction<Mesh>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }

    private setGeometry(geometry: MeshGeometry): void {
      this.three.geometry = geometry
    }

    private setMaterial(material: MeshMaterial): void {
      this.three.material = material
    }

    public setPositionFromPhysicsBody(body: Body): void {
      requestAnimationFrame(() => this.setPositionFromPhysicsBody(body))

      this.three.position.copy(body.position as unknown as Vector3)
      this.three.quaternion.copy(body.quaternion as unknown as Quaternion)
    }
  }
</script>
