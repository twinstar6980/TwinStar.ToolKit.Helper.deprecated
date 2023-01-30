import {
	createContext,
	useLayoutEffect,
	useMemo,
	useState,
} from 'react';

import {
	Theme,
	createTheme,
	PaletteMode,
	Backdrop as MBackdrop,
	CircularProgress as MCircularProgress,
} from '@mui/material';

import {
	useOpenLogic,
	useValue,
} from '../utility/Hook';

import Cookies from 'js-cookie';

// ------------------------------------------------

type MessengerContextType = {
	backdrop: {
		element: React.ReactElement;
		open: () => void;
		close: () => void;
	};
	snackbar: {
		element: React.ReactElement;
		open: () => void;
		close: () => void;
	};
};

const MessengerContext = createContext<MessengerContextType>(undefined as any);

// ------------------------------------------------

function Backdrop(props: {
	state: boolean;
}) {
	const { state } = props;
	return (
		<MBackdrop
			open={state}
			transitionDuration={400}
			sx={{ zIndex: (theme) => (theme.zIndex.drawer + 1) }}
		>
			<MCircularProgress color='inherit' />
		</MBackdrop>
	);
}

function useMessenger(
): MessengerContextType {
	const backdropState = useOpenLogic(false);
	const backdropElement = useMemo(() => (
		void console.log(`render backdropElement`) ||
		<Backdrop state={backdropState.state} />
	), [backdropState.state]);
	return {
		backdrop: {
			element: backdropElement,
			open: backdropState.open,
			close: backdropState.close,
		},
		snackbar: {
			element: backdropElement,
			open: backdropState.open,
			close: backdropState.close,
		},
	};
}

// ------------------------------------------------

export { MessengerContext, useMessenger };