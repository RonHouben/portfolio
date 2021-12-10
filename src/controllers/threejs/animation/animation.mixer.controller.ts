import type { AnimationAction, AnimationActionLoopStyles, Object3D } from 'three'
import { AnimationMixer, AnimationClip, Clock } from 'three'

export class AnimationMixerController<T extends Object3D> {
  public three: AnimationMixer
  public rootObject: T
  private readonly clock: Clock

  constructor(rootObject: T) {
    this.rootObject = rootObject
    this.three = new AnimationMixer(this.rootObject)
    this.clock = new Clock()

    this.update()
  }

  private update(): void {
    requestAnimationFrame(this.update.bind(this))

    const delta = this.clock.getDelta()
    this.three.update(delta)
  }

  public playAllAnimations(): void {
    for (const clip of this.rootObject.animations) {
      this.three.clipAction(clip).play()
    }
  }

  public playAnimationByName(
    name: string,
    loopMode?: AnimationActionLoopStyles,
    repetitions?: number
  ): void {
    const clip = AnimationClip.findByName(this.rootObject.animations, name)
    const action: AnimationAction | null = this.three.clipAction(clip)

    if (action) {
      if (loopMode && repetitions) {
        action.setLoop(loopMode, repetitions)
      }
      action.play()
    }
  }
}
