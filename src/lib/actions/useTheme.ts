import type { ThemeContext } from '$lib/contexts/types'
import { getContext } from 'svelte'

export const useTheme = (): ThemeContext => getContext<ThemeContext>('theme')
