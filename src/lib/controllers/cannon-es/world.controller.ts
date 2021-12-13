import type { WorldOptions } from 'cannon-es'
import { World } from 'cannon-es'
import { setContext } from 'svelte'

export class WorldController {
  public cannon: World
  private lastCallTime?: number
  private timeStep: number = 1 / 60 // seconds

  constructor(options: WorldOptions) {
    this.cannon = new World(options)

    setContext<World>('world', this.cannon)
  }

  public renderLoop(): void {
    requestAnimationFrame(this.renderLoop.bind(this))

    const time = performance.now() / 1000 // seconds

    if (!this.lastCallTime) {
      this.cannon.step(this.timeStep)
    } else {
      const dt = time - this.lastCallTime
      this.cannon.step(this.timeStep, dt)
    }
    this.lastCallTime = time
  }
}
