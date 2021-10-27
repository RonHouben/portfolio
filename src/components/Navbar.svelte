<script lang="ts">
	import type { ThemeContext } from 'src/contexts/types';
	import { getContext } from 'svelte';

	const { theme, toggle } = getContext<ThemeContext>('theme');
</script>

<nav>
	<div id="logo">Ron Houben</div>
	<button on:click={toggle}>{$theme.name}</button>
</nav>

<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 5vh;
		width: 100%;
		padding-top: var(--theme-spacing-padding-sm);
		padding-bottom: var(--theme-spacing-padding-sm);
		background-color: var(--theme-colors-background);
	}

	#logo {
		text-transform: uppercase;
	}
</style>
