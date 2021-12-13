import * as CANNON from 'cannon-es'
import type { ColorRepresentation, Mesh } from 'three'
import * as THREE from 'three'

interface CannonDebugRendererOptions {
  color: ColorRepresentation
}

export class CannonDebugRenderer {
  private scene: THREE.Scene
  private world: CANNON.World

  private meshes: THREE.Mesh[] = []
  private material: THREE.MeshBasicMaterial
  private sphereGeometry: THREE.SphereGeometry
  private boxGeometry: THREE.BoxGeometry
  private planeGeometry: THREE.PlaneGeometry

  // for updating positions
  private tmpVec0 = new CANNON.Vec3()
  private tmpQuat0 = new CANNON.Quaternion()

  constructor(scene: THREE.Scene, world: CANNON.World, options: CannonDebugRendererOptions) {
    this.scene = scene
    this.world = world

    this.material = new THREE.MeshBasicMaterial({ color: options.color, wireframe: true })
    this.sphereGeometry = new THREE.SphereGeometry(1)
    this.boxGeometry = new THREE.BoxGeometry(1, 1, 1)
    this.planeGeometry = new THREE.PlaneGeometry(10, 10, 10, 10)
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

        this.updateMesh(meshIndex, body, shape)

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

  private updateMesh(index: number, body: CANNON.Body, shape: CANNON.Shape): void {
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
    mesh: THREE.Mesh,
    shape: CANNON.Shape | CANNON.ConvexPolyhedron | CANNON.Trimesh | CANNON.Heightfield
  ): boolean {
    if (!mesh) {
      return false
    }

    const geo = mesh.geometry

    return (
      (geo instanceof THREE.SphereGeometry && shape instanceof CANNON.Sphere) ||
      (geo instanceof THREE.BoxGeometry && shape instanceof CANNON.Box) ||
      (geo instanceof THREE.PlaneGeometry && shape instanceof CANNON.Plane) ||
      (geo.id === shape.id && shape instanceof CANNON.ConvexPolyhedron) ||
      (geo.id === shape.id && shape instanceof CANNON.Trimesh) ||
      (geo.id === shape.id && shape instanceof CANNON.Heightfield)
    )
  }

  private createMesh(shape: CANNON.Shape): Mesh {
    const material = this.material
    let mesh: THREE.Mesh | undefined = undefined

    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        mesh = new THREE.Mesh(this.sphereGeometry, material)
        break
      case CANNON.Shape.types.BOX:
        mesh = new THREE.Mesh(this.boxGeometry, material)
        break
      case CANNON.Shape.types.PLANE:
        mesh = new THREE.Mesh(this.planeGeometry, material)
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

  private scaleMesh(mesh: Mesh, shape: CANNON.Shape) {
    const sphere = shape as CANNON.Sphere
    const box = shape as CANNON.Box
    const trimesh = shape as CANNON.Trimesh

    switch (shape.type) {
      case CANNON.Shape.types.SPHERE:
        mesh.scale.set(sphere.radius, sphere.radius, sphere.radius)
        break

      case CANNON.Shape.types.BOX:
        mesh.scale.set(box.halfExtents.x, box.halfExtents.y, box.halfExtents.z)
        mesh.scale.multiplyScalar(2)
        break

      case CANNON.Shape.types.CONVEXPOLYHEDRON:
        mesh.scale.set(1, 1, 1)
        break

      case CANNON.Shape.types.TRIMESH:
        mesh.scale.set(trimesh.scale.x, trimesh.scale.y, trimesh.scale.z)
        break

      case CANNON.Shape.types.HEIGHTFIELD:
        mesh.scale.set(1, 1, 1)
        break
    }
  }
}
