<script lang="ts">
  import Mesh from '../components/threejs/objects/Mesh.svelte'
  import { MeshPhysicalMaterial } from 'three'
  import { PCFSoftShadowMap, sRGBEncoding } from 'three'
  import { useTheme } from '../actions/useTheme'
  import PerspectiveCamera from '../components/threejs/cameras/PerspectiveCamera.svelte'
  import AmbientLight from '../components/threejs/lights/AmbientLight.svelte'
  import Raycaster from '../components/threejs/Raycaster.svelte'
  import WebGlRenderer from '../components/threejs/renderers/WebGLRenderer.svelte'
  import Scene from '../components/threejs/scenes/Scene.svelte'
  import { MouseHelper } from '$lib/threejs/MouseHelper'
  import DirectionalLight from '../components/threejs/lights/DirectionalLight.svelte'
  import SpotLight from '../components/threejs/lights/SpotLight.svelte'
  import Grid from '../components/Grid.svelte'
  import Physics from '../components/cannon-es/Physics.svelte'
  import { Vec3 } from 'cannon-es'
  import { MeshBasicMaterial } from 'three'
  import PhysicsBody from '../components/cannon-es/PhysicsBody.svelte'
  import * as CANNON from 'cannon-es'
  import { SphereGeometry } from 'three'
  import { BoxGeometry } from 'three'

  const { toggle } = useTheme()
</script>

<div class="canvas-container">
  <Physics
    options={{
      gravity: new Vec3(0, -9.82, 0) // m/s²
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
                }
              }}
            />
            <DirectionalLight
              options={{
                name: 'directional-light-bottom',
                color: '#055F66',
                targetName: 'ball',
                position: {
                  y: -10
                }
              }}
            />
          </svelte:fragment>
          <!-- Meshes -->
          <svelte:fragment slot="meshes">
            <PhysicsBody
              options={{
                type: CANNON.Body.KINEMATIC,
                shape: new CANNON.Sphere(2.5),
                mass: 5
              }}
              onMousemove={(target, mousePosition) => {
                MouseHelper.followMouse(mousePosition.x, mousePosition.y, target)
              }}
            >
              <Mesh
                options={{
                  geometry: new SphereGeometry(2.5),
                  material: new MeshPhysicalMaterial({
                    clearcoat: 0.5,
                    metalness: 1
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
              rows={20}
              columns={20}
              depth={1}
              cellDistance={0.5}
              cellSize={0.25}
              position={{
                // x: -(5 / 4) // + 0.25,
                // y: -(10 / 4) // + 0.25
              }}
            />

            <PhysicsBody
              options={{
                type: CANNON.Body.STATIC,
                shape: new CANNON.Box(new CANNON.Vec3(10, 10, 0.5)),
                position: new CANNON.Vec3(0, 0, 0),
                rotation: {
                  x: -(Math.PI / 2)
                }
              }}
            >
              <Mesh
                options={{
                  name: 'plane',
                  geometry: new BoxGeometry(10, 10, 0.5),
                  material: new MeshBasicMaterial({
                    opacity: 0.5,
                    color: 'grey',
                    transparent: true
                  }),
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
  </Physics>
</div>

<section>
  <h1 style="user-select: none;">HELLO WORLD</h1>
</section>

<style>
  section {
    padding-left: var(--theme-spacing-padding-sm);
  }
  .canvas-container {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    height: 100vh;
    z-index: 1;
    cursor: none;
  }
</style>
