<script lang="ts">
  import PhysicsBody from '$lib/components/cannon-es/PhysicsBody.svelte'
  import PhysicsWorld from '$lib/components/cannon-es/PhysicsWorld.svelte'
  import Grid from '$lib/components/Grid.svelte'
  import PerspectiveCamera from '$lib/components/threejs/cameras/PerspectiveCamera.svelte'
  import AmbientLight from '$lib/components/threejs/lights/AmbientLight.svelte'
  import DirectionalLight from '$lib/components/threejs/lights/DirectionalLight.svelte'
  import SpotLight from '$lib/components/threejs/lights/SpotLight.svelte'
  import Mesh from '$lib/components/threejs/objects/Mesh.svelte'
  import Raycaster from '$lib/components/threejs/Raycaster.svelte'
  import WebGlRenderer from '$lib/components/threejs/renderers/WebGLRenderer.svelte'
  import Scene from '$lib/components/threejs/scenes/Scene.svelte'
  import { MouseHelper } from '$lib/utils/MouseHelper'
  import anime from 'animejs'
  import * as CANNON from 'cannon-es'
  import { Vec3 } from 'cannon-es'
  import { BoxGeometry,MeshPhysicalMaterial,PCFSoftShadowMap,sRGBEncoding } from 'three'
</script>

<div class="canvas-container">
  <PhysicsWorld
    options={{
      gravity: new Vec3(0, -9.82, 0), // m/s²
      debug: false,
      materials: [
        new CANNON.Material('bouncy'),
        new CANNON.Material('slippery'),
        new CANNON.Material('cube'),
      ]
    }}
    createContactMaterials={(materials) => {
      const bouncyMaterial = materials[0]
      const slipperyMaterial = materials[1]
      const cubeMaterial = materials[2]

      const cubeOnBouncyContactMaterial = new CANNON.ContactMaterial(bouncyMaterial, cubeMaterial, {
        friction: 0.9,
        restitution: 0.9,
        // frictionEquationStiffness: 0.1

      })

      const cubeOnSlipperyContactMaterial = new CANNON.ContactMaterial(slipperyMaterial, cubeMaterial, {
        friction: 0,
        restitution: 0.0,
      })

      return [ cubeOnBouncyContactMaterial, cubeOnSlipperyContactMaterial  ]
    }}
  >
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
            name: 'scene'
          }}
        >
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
                far: 1000
              }}
            />
          </svelte:fragment>
          <svelte:fragment slot="helpers">
            <!-- <StatsHelper /> -->
            <!-- <OrbitControls options={{
              cameraName: 'perspective'
            }} /> -->
          </svelte:fragment>
          <!-- Raycaster -->
          <Raycaster options={{ cameraName: 'perspective' }} slot="raycaster" />

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
                targetName: 'ball',
                color: '#5CD85A',
                intensity: 4,
                position: {
                  y: 10,
                  x: -10
                },
                shadow: {
                  castShadow: true
                }
              }}
            />
            <SpotLight
              options={{
                name: 'spotlight-right',
                targetName: 'ball',
                color: '#107869',
                position: {
                  y: 10,
                  x: 10
                },
                shadow: {
                  castShadow: true
                }
              }}
            />
            <DirectionalLight
              options={{
                name: 'directional-light-bottom',
                color: '#055F66',
                targetName: 'ball',
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
                type: CANNON.Body.KINEMATIC,
                materialName: 'bouncy',
                shape: new CANNON.Box(new CANNON.Vec3(5, 1, 1)),
                mass: 2,
              }}
              onMousemove={({ target, mousePosition }) => {
                MouseHelper.followMouse(mousePosition.x, mousePosition.y, target)
              }}
              onClick={({ target }) => {
                anime({
                  targets: target.quaternion,
                  y: Math.round(target.quaternion.y) === 1 ? Math.random() * -1 : Math.random() * 1,
                  duration: 3000
                })
              }}
            >
              <Mesh
                options={{
                  geometry: new BoxGeometry(10, 2, 2),
                  material: new MeshPhysicalMaterial({
                    // opacity: 0.5,
                    // transparent: true,
                    clearcoat: 1,
                    metalness: 1,
                    roughness: 0.5
                  }),
                  name: 'ball',
                  position: {
                    x: 0,
                    y: 0,
                    z: 0
                  },
                  shadow: {
                    castShadow: true,
                    receiveShadow: true
                  }
                }}
              />
            </PhysicsBody>

            <Grid
              name="grid"
              rows={10}
              columns={10}
              depth={2}
              cellDistance={0.5}
              cellSize={0.25}
              position={{
                // x: -(10 / 2) // + 0.25,
                // y: -(10 / 4) // + 0.25
              }}
            />

            <PhysicsBody
              options={{
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
                  name: 'plane',
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
                  position: {
                    x: 0,
                    y: -4,
                    z: 0
                  },
                  rotation: {
                    x: -(Math.PI / 2)
                  }
                }}
              />
            </PhysicsBody>
          </svelte:fragment>
        </Scene>
      </svelte:fragment>
    </WebGlRenderer>
  </PhysicsWorld>
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
    cursor: none;
  }
</style>
