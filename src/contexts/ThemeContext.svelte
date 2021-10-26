<script lang="ts">
	import { setContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { themes, Theme } from '../themes';

	const initialTheme = themes[0];

	const getCurrentTheme = (name: Theme['name']): Theme => themes.find((theme) => theme.name === name);

	const themeStore = writable(getCurrentTheme(initialTheme.name));

	setContext('theme', {
		theme: themeStore,
		toggle: () => {
			const currentThemeIndex = themes.findIndex((theme) => theme.name === $themeStore.name);
			const isIndexOutOfBounds = currentThemeIndex === -1 || currentThemeIndex >= themes.length - 1;

			if (isIndexOutOfBounds) {
				const newTheme = getCurrentTheme(themes[0].name);

				themeStore.update((theme) => ({ ...theme, ...newTheme }));
				setCSSTheme(newTheme);
			} else {
				const newIndex = currentThemeIndex + 1;
				const newTheme = getCurrentTheme(themes[newIndex].name);

				themeStore.update((theme) => ({ ...theme, ...newTheme }));
				setCSSTheme(newTheme);
			}
		}
	});

	onMount(() => {
		// set CSS vars on mount
		setCSSTheme(getCurrentTheme($themeStore.name));
	});

	const setCSSTheme = (theme: Theme): void => {
		// set css theme-name
		document.documentElement.style.setProperty('--theme-name', theme.name);

		const setCSSVariables = (cssVariable: string, partialTheme: Partial<Theme>): void => {
			for (const [key, val] of Object.entries(partialTheme)) {
				if (key === 'name') continue;
				
				if (typeof val === 'string')  {
					document.documentElement.style.setProperty(`${cssVariable}-${key}`, val);
					// continue;
				} 

				if (typeof val === 'object') {
					setCSSVariables(`${cssVariable}-${key}`, val as Partial<Theme>);
				}
			}
		};

		setCSSVariables('--theme', theme);
	};
</script>

<slot></slot>
