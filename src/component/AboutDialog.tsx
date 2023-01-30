import {
	useMemo,
} from 'react';

import {
	Typography as MTypography,
	Dialog as MDialog,
	DialogTitle as MDialogTitle,
	DialogContent as MDialogContent,
	Divider as MDivider,
} from '@mui/material';

// ------------------------------------------------

function AboutDialog(props: {
	open: boolean;
	onClose: () => void;
}) {
	const { open, onClose } = props;
	return (
		<MDialog className='acrylic-c'
			maxWidth='md' fullWidth
			open={open} onClose={onClose}
		>
			<MDialogTitle>关于</MDialogTitle>
			<MDialogContent dividers sx={{ display: 'flex', flexDirection: 'column' }}>
				<MTypography variant='h5' gutterBottom>
					TwinStar ToolKit - Helper (deprecated)
				</MTypography>
				<MTypography variant='caption' gutterBottom>
					Copyright © 2021 TwinStar
				</MTypography>
				<MDivider sx={{ my: 1 }} />
				<MTypography variant='caption' sx={{ textTransform: 'uppercase' }}>
					React 17.0.2
					<br />
					MUI 5.11.6
				</MTypography>
			</MDialogContent>
		</MDialog>
	);
}

// ------------------------------------------------

export { AboutDialog };