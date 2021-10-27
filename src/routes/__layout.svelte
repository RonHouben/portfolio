<script lang="ts">
	import ThemeContext from '../contexts/ThemeContext.svelte';

	import Navbar from '../components/Navbar.svelte';
</script>

<svelte:head>
	<title>Ron Houben's Portfolio</title>
</svelte:head>

<main>
	<ThemeContext>
		<Navbar />
		<slot />
	</ThemeContext>
</main>

<style>
	:global(html, body, #svelte) {
		min-height: 100vh;
		-webkit-box-sizing: border-box;
		-moz-box-sizing: border-box;
		box-sizing: border-box;
		margin: 0;
		padding: 0;

		background-color: var(--theme-colors-background);
		color: var(--theme-colors-text);
	}
	:global(*, *:before, *:after) {
		-webkit-box-sizing: inherit;
		-moz-box-sizing: inherit;
		box-sizing: inherit;
	}

	main {
		height: 95vh;
		padding-right: var(--theme-spacing-padding-md);
		padding-left: var(--theme-spacing-padding-md);
	}
</style>
