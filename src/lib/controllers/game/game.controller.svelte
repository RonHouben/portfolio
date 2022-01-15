<script lang="ts" context="module">
  import { singleton } from '$lib/utils/Singleton.svelte'
  import { CameraController } from './camera.controller.svelte'
  import { TargetLocationController } from './targetLocation.controller.svelte'
  import { PlayerController } from './player.controller.svelte'
  import { StateMachine } from '$lib/utils/StateMachine.svelte'
  import type { Vector3 } from '$lib/utils/math/vector3.svelte'

  type StateEventMapping = {
    idle: 'move-player'
    'moving-player': 'stop-moving-player' | 'move-player'
  }

  type Events = 'move-player' | 'stop-moving-player'

  type EventData = {
    'move-player': Vector3
  }

  @singleton
  export class GameController {
    private readonly stateMachine: StateMachine<StateEventMapping, Events, EventData>
    private readonly playerController: PlayerController
    private readonly playerTargetLocationController: TargetLocationController
    private readonly cameraController: CameraController

    constructor() {
      this.stateMachine = new StateMachine({
        id: 'gameMachine',
        initial: 'idle',
        states: {
          idle: {
            'move-player': {
              target: 'moving-player'
            },
          },
          'moving-player': {
            entry: (data) => this.movePlayer(data),
            'stop-moving-player': {
              target: 'idle',
              action: () => this.stopMovingPlayer()
            },
            'move-player': {
              target: 'moving-player'
            }
          }
        }
      })

      this.playerController = new PlayerController()
      this.playerTargetLocationController = new TargetLocationController('player-target-location')
      this.cameraController = new CameraController()
    }

    private async movePlayer(data: EventData['move-player']): Promise<void> {
      this.playerTargetLocationController.send('teleport', data)
      await this.playerTargetLocationController.send('fade-in')

      await this.playerController.send('move', data)
      // TODO: Fix camera issue
      this.cameraController.send('move', data)
    }

    private async stopMovingPlayer(): Promise<void> {
      this.playerController.send('stop-moving')
      this.cameraController.send('stop-moving')
      this.playerTargetLocationController.send('fade-out')
    }

    // TODO: Find a way to get the Events from the StateEventMapping
    public async send<T>(event: Events, data?: T): Promise<void> {
      await this.stateMachine.send(event, data)
    }

    get state(): StateMachine<StateEventMapping, Events, EventData>['current'] {
      return this.stateMachine.current
    }
  }
</script>
