import type { ContactMaterial } from 'cannon-es'
import * as CANNON from 'cannon-es'
import { setContext } from 'svelte'

export type WorldControllerOptions = CANNON.WorldOptions & {
  materials?: CANNON.Material[]
  createContactMaterials?: (materials: CANNON.Material[]) => ContactMaterial[]
}
export class WorldController {
  public cannon: CANNON.World
  private lastCallTime?: number
  private timeStep: number = 1 / 60 // seconds

  constructor(options: WorldControllerOptions) {
    this.cannon = new CANNON.World(options)

    this.setMaterials(options.materials)
    this.createContactMaterials(options.createContactMaterials)

    setContext<CANNON.World>('world', this.cannon)
  }

  private setMaterials(materials: WorldControllerOptions['materials']): void {
    if (materials) {
      for (const material of materials) {
        this.cannon.addMaterial(material)
      }
    }
  }

  // TODO: create a Material component instead of this helper function
  // the materials can be saved in a store
  private createContactMaterials(func: WorldControllerOptions['createContactMaterials']): void {
    if (func) {
      const contactMaterials = func(this.cannon.materials)

      if (contactMaterials) {
        for (const contactMaterial of contactMaterials) {
          this.cannon.addContactMaterial(contactMaterial)
        }
      }
    }
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
