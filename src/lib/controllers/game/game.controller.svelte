<script lang="ts" context="module">
  import { isVector3 } from '$lib/utils/math/vector3.svelte'
  import { singleton } from '$lib/utils/Singleton.svelte';
  import { CameraController } from './camera.controller.svelte'
  import { TargetLocationController } from './targetLocation.controller.svelte'
  import { PlayerController } from './player.controller.svelte'

  type State = 'idle' | 'moving-player'
  type Event = 'move-player' | 'stop-moving-player'

  @singleton
  export class GameController {
    static instance: GameController
    private state: State
    private readonly playerController: PlayerController
    private readonly playerTargetLocationController: TargetLocationController 
    private readonly cameraController: CameraController

    constructor() {
      this.state = 'idle'

      this.playerController = new PlayerController('player')
      this.playerTargetLocationController = new TargetLocationController('player-target-location')
      this.cameraController = new CameraController()
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canPlayerMove = this.state === 'idle' && isVector3(data)
      const canPlayerCancelMove = this.state === 'moving-player'

      if (event === 'move-player' && canPlayerMove) {
        this.state = 'moving-player'

        this.playerTargetLocationController.send('teleport', data)

        // setTimeout is a workaround to fix the appareance flicker on the old position of the cursorController
        // setTimeout(() => {
        // }, 10)
        this.playerTargetLocationController.send('fade-in')
        await this.playerController.send('move', data)
        // TODO: Fix camera issue
        await this.cameraController.send('move', data)
      }

      if (event === 'stop-moving-player' && canPlayerCancelMove) {
        this.playerTargetLocationController.send('fade-out')
        await this.playerController.send('stop-moving')

        this.state = 'idle'
      }
    }
  }
</script>
