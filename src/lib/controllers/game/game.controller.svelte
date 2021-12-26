<script lang="ts" context="module">
	import { isVector3 } from '$lib/utils/math/vector3.svelte';
  import { Singleton } from '$lib/utils/Singleton.svelte'
  import { CameraController } from './camera.controller.svelte'
  import { CursorController } from './cursor.controller.svelte'
  import { PlayerController } from './player.controller.svelte'

  type State = 'idle' | 'moving-player'
  type Event = 'move-player' | 'cancel-move-player'

  @Singleton
  export class GameController {
    private state: State
    private readonly playerController: PlayerController
    private readonly cursorController: CursorController
    private readonly cameraController: CameraController

    constructor() {
      this.state = 'idle'

      this.playerController = new PlayerController('player')
      this.cursorController = new CursorController('cursor')
      this.cameraController = new CameraController('perspective')
    }

    public async send<T>(event: T | Event, data?: T): Promise<void> {
			const canMovePlayer = this.state === 'idle' && isVector3(data)
			const canCancelMovePlayer = this.state === 'moving-player'
			
      if (event === 'move-player' && canMovePlayer) {
        this.state = 'moving-player'

        this.cursorController.send('show')
        this.cursorController.send('move', data)
        this.cameraController.send('move', data)
        await this.playerController.send('move', data)
        this.cursorController.send('hide')

        this.state = 'idle'
      }

      if (event === 'cancel-move-player' && canCancelMovePlayer) {
				this.playerController.send('cancel-move')
				this.state = 'idle'
      }
    }
  }
</script>
