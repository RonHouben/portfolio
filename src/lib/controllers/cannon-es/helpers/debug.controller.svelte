<script lang="ts" context="module">
  import {
    Box,
    ConvexPolyhedron,
    Cylinder,
    Heightfield,
    Plane,
    Quaternion,
    Shape,
    Sphere,
    Trimesh,
    Vec3,
    World
  } from 'cannon-es'
  import { SphereGeometry } from 'three'
  import { PlaneGeometry } from 'three'
  import { BoxGeometry } from 'three'
  import { MeshBasicMaterial } from 'three'
  import type { Scene } from 'three'
  import type { ColorRepresentation } from 'three'
  import { Mesh } from 'three'
  import { CylinderGeometry } from 'three';

  interface PhysicsDebugControllerOptions {
    color: ColorRepresentation
  }

  export class PhysicsDebugController {
    private scene: Scene
    private world: World

    private meshes: Mesh[] = []
    private material: MeshBasicMaterial
    private sphereGeometry: SphereGeometry
    private boxGeometry: BoxGeometry
    private planeGeometry: PlaneGeometry
    private cylinderGeometry: CylinderGeometry

    // for updating positions
    private tmpVec0 = new Vec3()
    private tmpQuat0 = new Quaternion()

    constructor(scene: Scene, world: World, options: PhysicsDebugControllerOptions) {
      this.scene = scene
      this.world = world

      this.material = new MeshBasicMaterial({ color: options.color, wireframe: true })
      this.sphereGeometry = new SphereGeometry(1)
      this.boxGeometry = new BoxGeometry(1, 1, 1)
      this.planeGeometry = new PlaneGeometry(10, 10, 10, 10)
      this.cylinderGeometry = new CylinderGeometry(1, 1, 1)
    }

    public renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      this.update()
    }

    private update(): void {
      const bodies = this.world.bodies
      const meshes = this.meshes
      const shapeWorldPosition = this.tmpVec0
      const shapeWorldQuaternion = this.tmpQuat0

      let meshIndex = 0

      for (let i = 0; i !== bodies.length; i++) {
        const body = bodies[i]

        for (let j = 0; j !== body.shapes.length; j++) {
          const shape = body.shapes[j]

          this.updateMesh(meshIndex, shape)

          const mesh = meshes[meshIndex]

          if (mesh) {
            // Get world position
            body.quaternion.vmult(body.shapeOffsets[j], shapeWorldPosition)
            body.position.vadd(shapeWorldPosition, shapeWorldPosition)

            // Get world quaternion
            body.quaternion.mult(body.shapeOrientations[j], shapeWorldQuaternion)

            // Copy to meshes
            mesh.position.set(shapeWorldPosition.x, shapeWorldPosition.y, shapeWorldPosition.z)
            mesh.quaternion.set(
              shapeWorldQuaternion.x,
              shapeWorldQuaternion.y,
              shapeWorldQuaternion.z,
              shapeWorldQuaternion.w
            )
          }

          meshIndex++
        }
      }

      for (let i = meshIndex; i < meshes.length; i++) {
        const mesh = meshes[i]
        if (mesh) {
          this.scene.remove(mesh)
        }
      }

      meshes.length = meshIndex
    }

    private updateMesh(index: number, shape: Shape): void {
      let mesh = this.meshes[index]

      if (!this.typeMatch(mesh, shape)) {
        if (mesh) {
          this.scene.remove(mesh)
        }
        mesh = this.meshes[index] = this.createMesh(shape)
      }
      this.scaleMesh(mesh, shape)
    }

    private typeMatch(
      mesh: Mesh,
      shape: Shape | ConvexPolyhedron | Trimesh | Heightfield
    ): boolean {
      if (!mesh) {
        return false
      }

      const geo = mesh.geometry

      return (
        (geo instanceof SphereGeometry && shape instanceof Sphere) ||
        (geo instanceof BoxGeometry && shape instanceof Box) ||
        (geo instanceof PlaneGeometry && shape instanceof Plane) ||
        (geo.id === shape.id && shape instanceof ConvexPolyhedron) ||
        (geo.id === shape.id && shape instanceof Trimesh) ||
        (geo.id === shape.id && shape instanceof Heightfield)
      )
    }

    private createMesh(shape: Shape): Mesh {
      const material = this.material
      let mesh: THREE.Mesh | undefined = undefined

      switch (shape.type) {
        case Shape.types.SPHERE:
          mesh = new Mesh(this.sphereGeometry, material)
          break
        case Shape.types.BOX:
          mesh = new Mesh(this.boxGeometry, material)
          break
        case Shape.types.PLANE:
          mesh = new Mesh(this.planeGeometry, material)
          break
        case Shape.types.CYLINDER:
          mesh = new Mesh(this.cylinderGeometry, material)
          break
        default:
          throw new Error(
            `CannoneDebugRenderer.createMesh not implemented for shape with type: "${shape.type}"`
          )
      }

      if (mesh) {
        this.scene.add(mesh)
      }

      return mesh
    }

    private scaleMesh(mesh: Mesh, shape: Shape) {
      const sphere = shape as Sphere
      const box = shape as Box
      const trimesh = shape as Trimesh
      const cylinder = shape as Cylinder

      switch (shape.type) {
        case Shape.types.SPHERE:
          mesh.scale.set(sphere.radius, sphere.radius, sphere.radius)
          break

        case Shape.types.BOX:
          mesh.scale.set(box.halfExtents.x, box.halfExtents.y, box.halfExtents.z)
          mesh.scale.multiplyScalar(2)
          break

        case Shape.types.CONVEXPOLYHEDRON:
          mesh.scale.set(1, 1, 1)
          break

        case Shape.types.TRIMESH:
          mesh.scale.set(trimesh.scale.x, trimesh.scale.y, trimesh.scale.z)
          break

        case Shape.types.HEIGHTFIELD:
          mesh.scale.set(1, 1, 1)
          break
        
        case Shape.types.CYLINDER:
          mesh.scale.set(cylinder.radiusTop, cylinder.height, cylinder.radiusTop)
      }
    }
  }
</script>
