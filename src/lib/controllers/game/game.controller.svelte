<script lang="ts" context="module">
  import { isVector3 } from '$lib/utils/math/vector3.svelte'
  import { CameraController } from './camera.controller.svelte'
  import { CursorController } from './cursor.controller.svelte'
  import { PlayerController } from './player.controller.svelte'

  type State = 'idle' | 'moving-player'
  type Event = 'move-player' | 'cancel-move-player'

  export class GameController {
    static instance: GameController
    private state: State
    private readonly playerController: PlayerController
    private readonly cursorController: CursorController
    private readonly cameraController: CameraController

    constructor() {
      this.state = 'idle'

      this.playerController = new PlayerController('player-group')
      this.cursorController = new CursorController('cursor')
      this.cameraController = new CameraController()
    }

    public async send<T>(event: Event, data?: T): Promise<void> {
      const canPlayerMove = this.state === 'idle' && isVector3(data)
      const canPlayerCancelMove = this.state === 'moving-player'

      if (event === 'move-player' && canPlayerMove) {
        this.state = 'moving-player'

        this.cursorController.send('show')
        this.cursorController.send('move', data)
        await this.playerController.send('rotate-to-target', data)
        this.cameraController.send('move', data)
        await this.playerController.send('move', data)
        this.cursorController.send('hide')

        this.state = 'idle'
      }

      if (event === 'cancel-move-player' && canPlayerCancelMove) {
        this.playerController.send('cancel-rotate-to-target')
        this.playerController.send('cancel-move')
        this.state = 'idle'
      }
    }
  }
</script>
