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
		width: 100%;
		height: 100%;
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
		height: 100vh;

		/* For mobile */
		padding-right: var(--theme-spacing-padding-sm);
		padding-left: var(--theme-spacing-padding-sm);
	}

	/* For desktop */
	@media only screen and (min-width: 768px) {
		main {
			padding-right: var(--theme-spacing-padding-md);
			padding-left: var(--theme-spacing-padding-md);
		}
	}
</style>
