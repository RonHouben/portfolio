export interface Theme {
	name: string;
	colors: {
		text: string;
		background: string;
	};
  spacing?: {
    padding: {
      [key: string]: string;
    };
    margin: {
      [key: string]: string;
    }
  }
}

export const themes: Theme[] = [
  {
    name: 'light',
    colors: {
      text: '#282230',
      background: '#f1f1f1',
    },
    spacing: {
      padding: {
        'sm': '0.5rem',
        'md': '5rem',
        'lg': '10rem'
      },
      margin: {
        'sm': '0.5rem',
        'md': '5rem',
        'lg': '10rem'
      }
    }
  },
  {
    name: 'dark',
    colors: {
      text: '#f1f1f1',
      background: '#27323a',
    },
  },
  {
    name: 'purple',
    colors: {
      text: '#f1f1f1',
      background: 'purple',
    },
  },
]