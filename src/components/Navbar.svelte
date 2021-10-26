<script lang="ts">
import type { ThemeContext } from 'src/contexts/types';

	import { getContext } from 'svelte';

	const { theme, toggle } = getContext<ThemeContext>('theme');

</script>


<nav>
	Ron Houben
	<div>
		<button on:click={toggle}>{$theme.name}</button>
	</div>
</nav>


<style>
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 5vh;
		width: 100vw;
		padding-right: var(--theme-spacing-padding-md);
		padding-left: var(--theme-spacing-padding-md);
		padding-top: var(--theme-spacing-padding-sm);
		padding-bottom: var(--theme-spacing-padding-sm);
		margin-bottom: var(--theme-spacing-margin-sm);
		background-color: var(--theme-colors-background);
	}
</style>