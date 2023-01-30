import {
	Box as MBox,
} from '@mui/material';

// ------------------------------------------------

function TabPanel(props: {
	value: number;
	current: number;
	children?: any;
}) {
	const { value, current, children } = props;
	return (
		<MBox sx={{ width: 1, height: 1, display: current === value ? undefined : 'none' }}>
			{children}
		</MBox>
	);
}

// ------------------------------------------------

export { TabPanel };