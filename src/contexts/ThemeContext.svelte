<script lang="ts">
	import { onMount, setContext } from 'svelte'
	import { writable } from 'svelte/store'
	import { Theme, themes } from '../themes'
	import type { ThemeContext } from './types'

	let isLoaded = false

	const initialTheme = themes.find(({ name }) => name === 'dark')

	const getCurrentTheme = (name: Theme['name']): Theme =>
		themes.find((theme) => theme.name === name)

	const themeStore = writable(getCurrentTheme(initialTheme.name))

	setContext<ThemeContext>('theme', {
		theme: themeStore,
		toggle: () => {
			const currentThemeIndex = themes.findIndex((theme) => theme.name === $themeStore.name)
			const isIndexOutOfBounds = currentThemeIndex === -1 || currentThemeIndex >= themes.length - 1

			if (isIndexOutOfBounds) {
				const firstTheme = getCurrentTheme(themes[0].name)

				themeStore.update((theme) => ({ ...theme, ...firstTheme }))
				setCSSTheme(firstTheme)
			} else {
				const nextIndex = currentThemeIndex + 1
				const nextTheme = getCurrentTheme(themes[nextIndex].name)

				themeStore.update((theme) => ({ ...theme, ...nextTheme }))
				setCSSTheme(nextTheme)
			}
		}
	})

	onMount(async () => {
		// set CSS vars on mount
		await setCSSTheme(getCurrentTheme($themeStore.name))
		isLoaded = true
	})

	const setCSSTheme = async (theme: Theme): Promise<void> => {
		// set css theme-name
		document.documentElement.style.setProperty('--theme-name', theme.name)

		const setCSSVariables = async (
			cssVariable: string,
			partialTheme: Partial<Theme>
		): Promise<void> => {
			for (const [key, val] of Object.entries(partialTheme)) {
				if (key === 'name') continue

				if (key === 'fonts') {
					const fonts = val as Theme['fonts']

					// only load the default selected font for performance reasons
					const { family, src } = fonts.find(({ defaultFont }) => defaultFont === true)

					const newFont = new FontFace(family, `url(${src})`)

					await newFont.load()

					// @ts-expect-error - this is an "experimental" feature that still has to be added to TS
					document.fonts.add(newFont)

					// set as default font
					document.documentElement.style.setProperty(`${cssVariable}-fonts-selected`, family)
				}

				if (typeof val === 'string') {
					document.documentElement.style.setProperty(`${cssVariable}-${key}`, val)
				}

				if (typeof val === 'object') {
					await setCSSVariables(`${cssVariable}-${key}`, val as Partial<Theme>)
				}
			}
		}

		await setCSSVariables('--theme', theme)
	}
</script>

{#if isLoaded}
	<slot />
{/if}
