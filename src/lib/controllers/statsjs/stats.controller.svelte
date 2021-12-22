<script lang="ts" context="module">
  import Stats from 'stats.js'
  import type { Renderer } from 'three'
  import { BaseHelperController } from '../threejs/helpers/base.helper.controller.svelte'

  export interface StatsControllerOptions {
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  }

  export class StatsHelperController extends BaseHelperController<Stats> {
    constructor(renderer: Renderer, options: StatsControllerOptions) {
      super()
      this.helper = new Stats()

      this.init(renderer, options)
      this.renderLoop()
    }

    private init(renderer: Renderer, options: StatsControllerOptions): void {
      renderer.domElement.parentElement!.appendChild(this.helper.dom)

      this.setPosition(options.position)
    }

    private setPosition(position: StatsControllerOptions['position']): void {
      switch (position) {
        case 'top-left':
          this.helper.dom.style.position = 'absolute'
          this.helper.dom.style.top = '0px'
          this.helper.dom.style.left = '0px'
          return
        case 'bottom-left':
          this.helper.dom.style.position = 'fixed'
          this.helper.dom.style.top = ''
          this.helper.dom.style.bottom = '0px'
          this.helper.dom.style.left = '0px'
          return
        case 'top-right':
          this.helper.dom.style.position = 'absolute'
          this.helper.dom.style.left = ''
          this.helper.dom.style.top = '0px'
          this.helper.dom.style.right = '0px'
          return
        case 'bottom-right':
          this.helper.dom.style.position = 'fixed'
          this.helper.dom.style.top = ''
          this.helper.dom.style.left = ''
          this.helper.dom.style.bottom = '0px'
          this.helper.dom.style.right = '0px'
          return
      }
    }

    private renderLoop(): void {
      requestAnimationFrame(this.renderLoop.bind(this))

      this.helper.update()
    }
  }
</script>
