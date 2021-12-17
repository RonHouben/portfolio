<script lang='ts' context='module'>
	import Stats from 'stats.js'

	export interface StatsControllerOptions {
		domElement: HTMLElement
		position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
	}

	export class StatsController {
		public stats: Stats

		constructor(options: StatsControllerOptions) {
			this.stats = new Stats()

			this.init(options)
			this.renderLoop()
		}

		private init(options: StatsControllerOptions): void {
			options.domElement.appendChild(this.stats.dom)
			
			this.setPosition(options.position)
		}

		private setPosition(position: StatsControllerOptions['position']): void {
			switch (position) {
				case 'top-left':
					this.stats.dom.style.position = 'absolute'
					this.stats.dom.style.top = '0px'
					this.stats.dom.style.left ='0px'
					return	
				case 'bottom-left':
					this.stats.dom.style.position = 'fixed'
					this.stats.dom.style.top = ''
					this.stats.dom.style.bottom = '0px'
					this.stats.dom.style.left = '0px'
					return
				case 'top-right':
					this.stats.dom.style.position = 'absolute'
					this.stats.dom.style.left = ''
					this.stats.dom.style.top = '0px'
					this.stats.dom.style.right = '0px'
					return
				case 'bottom-right':
					this.stats.dom.style.position = 'fixed'
					this.stats.dom.style.top = ''
					this.stats.dom.style.left = ''
					this.stats.dom.style.bottom = '0px'
					this.stats.dom.style.right = '0px'
					return
			}
		}

		private renderLoop(): void {
			requestAnimationFrame(this.renderLoop.bind(this))

			this.stats.update()
		}
	}
</script>