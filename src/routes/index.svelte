<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import PhysicsWorld from '$lib/components/cannon-es/PhysicsWorld.svelte'
  import Player from '$lib/components/game/Player.svelte'
import Grid from '$lib/components/Grid.svelte';
  import PerspectiveCamera from '$lib/components/threejs/cameras/PerspectiveCamera.svelte'
  import OrbitControls from '$lib/components/threejs/controls/OrbitControls.svelte'
  import AmbientLight from '$lib/components/threejs/lights/AmbientLight.svelte'
  import DirectionalLight from '$lib/components/threejs/lights/DirectionalLight.svelte'
  import SpotLight from '$lib/components/threejs/lights/SpotLight.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import Raycaster from '$lib/components/threejs/Raycaster.svelte'
  import WebGlRenderer from '$lib/components/threejs/renderers/WebGLRenderer.svelte'
  import Scene from '$lib/components/threejs/scenes/Scene.svelte'
  import { GameController } from '$lib/controllers/game/game.controller.svelte'
  import * as CANNON from 'cannon-es'
  import { Vec3 } from 'cannon-es'
  import { MeshPhongMaterial, PCFSoftShadowMap, PlaneGeometry, sRGBEncoding } from 'three'
</script>

<div class="canvas-container">
  <!-- svelte-ignore missing-declaration -->
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
              const cursorBody = bodies.find(({ name }) => name === 'cursor')
              const playerBody = bodies.find(({ name }) => name === 'player')

              if (cursorBody && playerBody) {
                // Vector that goes from the body to the clicked point
                const vector = new CANNON.Vec3()
                  .copy(cursorBody.position)
                  .vsub(playerBody.position)

                // Apply anti-quaternion to vector to tranform it into the local body coordinate system
                const antiRotation = playerBody.quaternion.inverse()
                const pivot = antiRotation.vmult(vector) // pivot is not in local body coordinates

                const constraint = new CANNON.PointToPointConstraint(
                  playerBody,
                  pivot,
                  cursorBody,
                  new CANNON.Vec3(0, 0, 0),
                  5
                )

                return []
              }
              return []
            }}
          />
        </svelte:fragment>
        <svelte:fragment slot="cameras">
          <PerspectiveCamera
            options={{
              name: 'perspective',
              // lookAt: 'player',
              position: {
                x: 0,
                y: 15,
                z: 15
              },
              rotation: {
                x: -0.75
              },
              focus: 0.5,
              fov: 50,
              near: 2,
              far: 1000,
              helpers: {
                enable: false
              }
            }}
          />
        </svelte:fragment>
        <!-- Raycaster -->
        <Raycaster slot="raycaster" options={{ cameraName: 'perspective' }} />

        <svelte:fragment slot="controls-disabled">
          <OrbitControls
            options={{
              cameraName: 'perspective',
              targetName: 'player',
              enableRotate: false,
              enablePan: false,
              enableZoom: false,
              enableDamping: true,
              dampingFactor: 0.9
            }}
          />
        </svelte:fragment>

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
              targetName: 'player',
              color: '#5CD85A',
              intensity: 0,
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
              targetName: 'player',
              color: '#107869',
              intensity: 2,
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
              targetName: 'player',
              position: {
                y: 5,
                z: 10
              },
              shadow: {
                castShadow: true
              },
              helpers: {
                enabled: false
              }
            }}
          />
        </svelte:fragment>
        <!-- Meshes -->
        <svelte:fragment slot="meshes">
          <Player />

          <Grid name='grid' cellDistance={1} cellSize={1} columns={5} rows={5} depth={5} position={{
            x: 0,
            y: 0,
            z: 0
          }}></Grid>

          <PhysicsBody
            options={{
              name: 'floor',
              type: CANNON.Body.STATIC,
              shape: new CANNON.Box(new CANNON.Vec3(25, 25, 0.025)),
              materialName: 'bouncy',
              position: new CANNON.Vec3(0, 0, 0),
              rotation: {
                x: -(Math.PI / 2)
              }
            }}
          >
            <Mesh
              options={{
                name: 'floor',
                geometry: new PlaneGeometry(50, 50),
                material: new MeshPhongMaterial({
                  // opacity: 0.3,
                  color: 'purple'
                  // transparent: true,
                  // clearcoat: 0.9,
                  // metalness: 0.9,
                  // roughness: 0.5
                }),
                shadow: {
                  receiveShadow: true,
                  castShadow: true
                },
                interactions: {
                  onClick: async ({ intersection }) => {
                    if (intersection) {
                      const gameController = new GameController()

                      if (gameController.state === 'moving-player') {
                        await gameController.send('stop-moving-player')
                      } 
                      gameController.send('move-player', intersection.point)
                    }
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
    position: fixed;
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
