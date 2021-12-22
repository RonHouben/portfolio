<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import PhysicsWorld from '$lib/components/cannon-es/PhysicsWorld.svelte'
  import Grid from '$lib/components/Grid.svelte'
  import PerspectiveCamera from '$lib/components/threejs/cameras/PerspectiveCamera.svelte'
  import OrbitControls from '$lib/components/threejs/controls/OrbitControls.svelte'
  import AmbientLight from '$lib/components/threejs/lights/AmbientLight.svelte'
  import DirectionalLight from '$lib/components/threejs/lights/DirectionalLight.svelte'
  import SpotLight from '$lib/components/threejs/lights/SpotLight.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import Raycaster from '$lib/components/threejs/Raycaster.svelte'
  import WebGlRenderer from '$lib/components/threejs/renderers/WebGLRenderer.svelte'
  import Scene from '$lib/components/threejs/scenes/Scene.svelte'
  import { MouseHelper } from '$lib/utils/MouseHelper.svelte'
  import * as CANNON from 'cannon-es'
  import { Vec3 } from 'cannon-es'
  import {
    BoxGeometry,
    MeshPhysicalMaterial,
    PCFSoftShadowMap,
    SphereGeometry,
    sRGBEncoding
  } from 'three'
</script>

<div class="canvas-container">
  <WebGlRenderer
    options={{
      alpha: true,
      antialias: true,
      outputEncoding: sRGBEncoding,
      shadowMap: {
        enabled: true,
        type: PCFSoftShadowMap
      }
    }}
  >
    <svelte:fragment slot="scenes">
      <Scene
        options={{
          name: 'scene',
          helpers: {
            axes: {
              enabled: false,
              size: 15
            },
            grid: {
              enabled: false,
              divisions: 10,
              size: 10
            },
            stats: {
              enabled: false,
              position: 'top-right'
            }
          }
        }}
      >
        <svelte:fragment slot="physics">
          <PhysicsWorld
            options={{
              gravity: new Vec3(0, -9.82, 0), // m/s²
              materials: [
                new CANNON.Material('bouncy'),
                new CANNON.Material('slippery'),
                new CANNON.Material('cube')
              ],
              helpers: {
                enabled: false
              }
            }}
            createContactMaterials={(materials) => {
              const bouncyMaterial = materials[0]
              const slipperyMaterial = materials[1]
              const cubeMaterial = materials[2]

              const cubeOnBouncyContactMaterial = new CANNON.ContactMaterial(
                bouncyMaterial,
                cubeMaterial,
                {
                  friction: 0.9,
                  restitution: 0.9
                }
              )

              const cubeOnSlipperyContactMaterial = new CANNON.ContactMaterial(
                slipperyMaterial,
                cubeMaterial,
                {
                  friction: 0,
                  restitution: 0.0
                }
              )

              return [cubeOnBouncyContactMaterial, cubeOnSlipperyContactMaterial]
            }}
            createConstraints={(bodies) => {
              const mouseBody = bodies.find(({ name }) => name === 'mouse')
              const rectangleBody = bodies.find(({ name }) => name === 'rectangle')

              if (mouseBody && rectangleBody) {
                // Vector that goes from the body to the clicked point
                const vector = new CANNON.Vec3()
                  .copy(mouseBody.position)
                  .vsub(rectangleBody.position)

                // Apply anti-quaternion to vector to tranform it into the local body coordinate system
                const antiRotation = rectangleBody.quaternion.inverse()
                const pivot = antiRotation.vmult(vector) // pivot is not in local body coordinates

                const constraint = new CANNON.PointToPointConstraint(
                  rectangleBody,
                  pivot,
                  mouseBody,
                  new CANNON.Vec3(0, 2, 0),
                  0.3
                )

                return [constraint]
              }
              return []
            }}
          />
        </svelte:fragment>
        <svelte:fragment slot="cameras">
          <PerspectiveCamera
            options={{
              name: 'perspective',
              position: {
                x: 0,
                y: 0,
                z: 15
              },
              rotation: {
                // x: 0.5
              },
              fov: 50,
              near: 2,
              far: 1000,
              helpers: {
                enable: false
              }
            }}
          />
        </svelte:fragment>
        <svelte:fragment slot="controls">
          <OrbitControls
            options={{
              cameraName: 'perspective',
              enableDamping: true,
              dampingFactor: 0.05,
              rotateSpeed: 0.05,
              panSpeed: 0.05,
              zoomSpeed: 0.005,
              maxDistance: 100,
              maxZoom: 20
            }}
          />
        </svelte:fragment>
        <!-- Raycaster -->
        <Raycaster slot="raycaster" options={{ cameraName: 'perspective' }} />

        <!-- Lights -->
        <svelte:fragment slot="lights">
          <AmbientLight
            options={{
              name: 'ambient-light',
              color: '#08313A',
              intensity: 0.75
            }}
          />
          <SpotLight
            options={{
              name: 'spotlight-left',
              targetName: 'mouse',
              color: '#5CD85A',
              intensity: 4,
              position: {
                y: 10,
                x: -10
              },
              shadow: {
                castShadow: true
              },
              helpers: {
                enabled: false,
                color: 'purple',
                shadowCamera: {
                  enabled: false
                }
              }
            }}
          />
          <SpotLight
            options={{
              name: 'spotlight-right',
              targetName: 'mouse',
              color: '#107869',
              intensity: 4,
              position: {
                y: 10,
                x: 10
              },
              shadow: {
                castShadow: true
              },
              helpers: {
                enabled: false,
                color: 'purple',
                shadowCamera: {
                  enabled: false
                }
              }
            }}
          />
          <DirectionalLight
            options={{
              name: 'directional-light-bottom',
              color: '#055F66',
              targetName: 'mouse',
              position: {
                y: -5,
                z: 10
              },
              shadow: {
                castShadow: true
              }
            }}
          />
        </svelte:fragment>
        <!-- Meshes -->
        <svelte:fragment slot="meshes">
          <PhysicsBody
            options={{
              name: 'rectangle',
              type: CANNON.Body.DYNAMIC,
              materialName: 'bouncy',
              shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
              position: new CANNON.Vec3(0, 0, 0),
              mass: 1,
              interactions: {
                onClick: (target) => {
                  console.log('clicked phsyics', target.name)
                }
              }
            }}
          >
            <Mesh
              options={{
                name: 'rectangle',
                geometry: new BoxGeometry(2, 2, 2),
                material: new MeshPhysicalMaterial({
                  // opacity: 0.5,
                  // transparent: true,
                  clearcoat: 1,
                  metalness: 1,
                  roughness: 0.5
                }),
                shadow: {
                  castShadow: true,
                  receiveShadow: true
                }
              }}
            />
          </PhysicsBody>

          <PhysicsBody
            options={{
              name: 'mouse',
              type: CANNON.Body.KINEMATIC,
              materialName: 'bouncy',
              shape: new CANNON.Sphere(1),
              position: new CANNON.Vec3(0, 0, 0),
              mass: 1.5,
              interactions: {
                onMouseMove: (target) => {
                  const mouseHelper = new MouseHelper()
                  mouseHelper.followMouse(target)
                }
              }
            }}
          >
            <Mesh
              options={{
                name: 'mouse',
                geometry: new SphereGeometry(1),
                material: new MeshPhysicalMaterial({
                  color: 'purple',
                  // opacity: 0.5,
                  // transparent: true,
                  clearcoat: 1,
                  metalness: 1,
                  roughness: 0.5
                }),
                shadow: {
                  castShadow: true,
                  receiveShadow: true
                }
              }}
            />
          </PhysicsBody>

          <Grid name="grid" rows={10} columns={10} depth={2} cellDistance={0.5} cellSize={0.25} />

          <PhysicsBody
            options={{
              name: 'floor',
              type: CANNON.Body.STATIC,
              shape: new CANNON.Box(new CANNON.Vec3(5, 5, 0.25)),
              materialName: 'slippery',
              position: new CANNON.Vec3(0, -4, 0),
              rotation: {
                x: -(Math.PI / 2)
              }
            }}
          >
            <Mesh
              options={{
                name: 'floor',
                geometry: new BoxGeometry(10, 10, 0.5),
                material: new MeshPhysicalMaterial({
                  // opacity: 0.3,
                  color: 'purple',
                  // transparent: true,
                  // clearcoat: 0.9,
                  metalness: 0.9,
                  roughness: 0.5
                }),
                shadow: {
                  receiveShadow: true,
                  castShadow: true
                },
                interactions: {
                  onClick: () => {
                    console.log('Clicked floor')
                  }
                }
              }}
            />
          </PhysicsBody>
        </svelte:fragment>
      </Scene>
    </svelte:fragment>
  </WebGlRenderer>
</div>

<section>
  <h1 style="user-select: none;">HELLO WORLD</h1>
</section>

<style>
  section {
    padding-left: var(--theme-padding-sm);
    padding-right: var(--theme-padding-sm);
  }
  .canvas-container {
    position: fixed;
    height: 100%;
    width: 100%;
    /* cursor: none; */
  }
</style>
