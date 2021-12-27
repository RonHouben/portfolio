<script lang="ts" context="module">
  import type { PhysicsBody } from '$lib/controllers/cannon-es/body.controller.svelte'
  import type {
    AnimateFunction,
    BaseControllerOptions,
    BaseInitOptions,
    ThreeJSObject
  } from '$lib/controllers/threejs/base.controller.svelte'
  import { BaseController } from '$lib/controllers/threejs/base.controller.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'
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
    Scene,
    SphereGeometry
  } from 'three'
  import { Mesh as ThreeMesh } from 'three'

  export interface Mesh extends ThreeMesh<MeshGeometry, MeshMaterial>, ThreeJSObject {}

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
    public readonly three: Mesh
    private readonly originalPosition: Mesh['position']
    protected readonly interactable: Mesh

    constructor(options: MeshControllerOptions) {
      const { name, interactions, geometry, material } = options
      super({ name, interactions })

      this.three = new ThreeMesh(geometry, material)
      this.three.name = name
     
      this.interactable = this.three

      this.init(options)

      this.originalPosition = this.three.position.clone()

      this.renderLoop()
    }

    protected override init(options: MeshInitOptions): void {
      this.setGeometry(options.geometry)
      this.setMaterial(options.material)
      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setShadow(options.shadow)

      this.scene.add(this.three)
    }

    private renderLoop(): void {
      {
        requestAnimationFrame(this.renderLoop.bind(this))

        if (this.physicsBody) {
          this.setPositionFromPhysicsBody(this.physicsBody, this.physicsBody.appendMeshPosition)
        }
      }
    }

    private setGeometry(geometry: MeshGeometry): void {
      this.three.geometry = geometry
    }

    private setMaterial(material: MeshMaterial): void {
      this.three.material = material
    }

    private setPositionFromPhysicsBody(physicsBody: PhysicsBody, appendMeshPosition: boolean): void {
      const positionX = appendMeshPosition ? physicsBody.position.x + this.originalPosition.x : physicsBody.position.x
      const positionY = appendMeshPosition ? physicsBody.position.y + this.originalPosition.y : physicsBody.position.y
      const positionZ = appendMeshPosition ? physicsBody.position.z + this.originalPosition.z : physicsBody.position.z

      this.three.position.set(
        positionX,
        positionY,
        positionZ
      )
      this.three.quaternion.set(
        physicsBody.quaternion.x,
        physicsBody.quaternion.y,
        physicsBody.quaternion.z,
        physicsBody.quaternion.w
      )
    }

    public updateOptions(options: MeshControllerOptions): void {
      this.setGeometry(options.geometry)
      this.setMaterial(options.material)
      this.setPosition(options.position)
      this.setRotation(options.rotation)
      this.setShadow(options.shadow)
    }

    public override animate(animateFunction: AnimateFunction<Mesh>): void {
      requestAnimationFrame(() => this.animate(animateFunction))

      animateFunction(this.three, this.scene)
    }
  }
</script>
