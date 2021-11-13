export interface Theme {
	name: string
	colors: {
		text: string
		background: string
	}
	fonts: Font[]
	spacing?: {
		padding: {
			[key: string]: string
		}
		margin: {
			[key: string]: string
		}
	}
}

interface Font {
	defaultFont: boolean
	family: string
	src: string
}

type BaseTheme = Theme

const baseTheme: BaseTheme = {
	name: 'base-theme',
	colors: {
		text: '#282230',
		background: '#f1f1f1'
	},
	fonts: [
		{
			defaultFont: true,
			family: 'Orbitron',
			src: '/fonts/Orbitron/Orbitron-Regular.ttf'
		}
	],
	spacing: {
		padding: {
			sm: '0.5rem',
			md: '5rem',
			lg: '10rem'
		},
		margin: {
			sm: '0.5rem',
			md: '5rem',
			lg: '10rem'
		}
	}
}

export const themes: Theme[] = [
	{
		...baseTheme,
		name: 'light',
		colors: {
			text: '#282230',
			background: '#f1f1f1'
		}
	},
	{
		...baseTheme,
		name: 'dark',
		colors: {
			text: '#f1f1f1',
			background: '#27323a'
		}
	},
	{
		...baseTheme,
		name: 'purple',
		colors: {
			text: '#f1f1f1',
			background: 'purple'
		}
	}
]
