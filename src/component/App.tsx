import '../common/style/global.css';

import {
	ThemeProvider as MThemeProvider,
} from '@mui/material';

import {
	MyThemeContext,
	useMyTheme,
} from '../common/my-theme/Context';

import {
	FullViewBox,
} from '../common/component/FullViewBox';

import '../common/my-theme/style.css';

import {
	useMemo,
} from 'react';

import {
	Page,
} from './Page';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// ------------------------------------------------

function App(props: {
}) {
	const myTheme = useMyTheme();
	const element = useMemo(() => (
		<FullViewBox>
			<Page />
		</FullViewBox>
	), []);
	return (
		<MyThemeContext.Provider value={myTheme}>
			<MThemeProvider theme={myTheme.value}>
				{element}
			</MThemeProvider>
		</MyThemeContext.Provider>
	);
}

// ------------------------------------------------

export { App };