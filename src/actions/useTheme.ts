import type { ThemeContext } from '../contexts/types'
import { getContext } from 'svelte'

export const useTheme = (): ThemeContext => getContext<ThemeContext>('theme')
