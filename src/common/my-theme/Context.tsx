import {
	createContext,
	useLayoutEffect,
	useMemo,
} from 'react';

import {
	Theme,
	createTheme,
	PaletteMode,
} from '@mui/material';

import {
	useValue,
} from '../utility/Hook';

import Cookies from 'js-cookie';

// ------------------------------------------------

const DEFAULT_THEME = createTheme();

type MyThemeContextType = {
	value: Theme;
	toggleMode: () => void;
};

const MyThemeContext = createContext<MyThemeContextType>(undefined as any);

// ------------------------------------------------

function useMyTheme(
): MyThemeContextType {
	const mode = useValue(Cookies.get('theme.mode') as PaletteMode || 'dark');
	const toggleMode = useMemo(() => () => {
		const newMode = mode.value! === 'light' ? 'dark' : 'light';
		mode.setValue(newMode);
		Cookies.set('theme.mode', newMode, { expires: 15 });
	}, []);
	const value = useMemo(() => (
		createTheme({
			palette: {
				mode: mode.value,
				primary: {
					main: mode.value === 'light' ? '#6200ee' : '#bb86fc'
				},
				secondary: {
					main: '#03dac5'
				},
				background: mode.value === 'light'
					? {
						paper: '#ffffff',
						default: '#ffffff',
					}
					: {
						paper: '#121212',
						default: '#121212',
					},
			},
			components: {
				MuiTypography: {
					defaultProps: {
						variantMapping: {
							h1: 'div',
							h2: 'div',
							h3: 'div',
							h4: 'div',
							h5: 'div',
							h6: 'div',
							subtitle1: 'div',
							subtitle2: 'div',
							body1: 'div',
							body2: 'div',
							caption: 'div',
							button: 'div',
							overline: 'div',
						},
					},
				}
			},
		})
	), [mode.value]);
	useLayoutEffect(() => {
		document.body.className = `use-material-design-scrollbar use-material-design-scrollbar-${mode.value}`;
		document.body.style.backgroundColor = mode.value === 'light' ? value.palette.background.default : '#212121';
		document.body.style.color = value.palette.common[mode.value === 'light' ? 'black' : 'white'];
	}, [mode.value]);
	return {
		value,
		toggleMode,
	};
}

// ------------------------------------------------

export { MyThemeContext, useMyTheme };