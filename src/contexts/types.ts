import type { Theme } from '../themes'
import type { Writable } from 'svelte/store'

export type ThemeContext = {
  theme: Writable<Theme>
  toggle: () => void
}
