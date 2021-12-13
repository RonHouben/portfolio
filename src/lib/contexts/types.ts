import type { Writable } from 'svelte/store'
import type { Theme } from '../../themes'

export type ThemeContext = {
  theme: Writable<Theme>
  toggle: () => void
}
