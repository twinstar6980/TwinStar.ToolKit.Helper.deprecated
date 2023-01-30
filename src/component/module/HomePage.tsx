import {
	Box as MBox,
	Typography as MTypography,
	Button as MButton,
	Paper as MPaper,
	Card as MCard,
	CardActions as MCardActions,
	CardContent as MCardContent,
} from '@mui/material';

import {
	ModuleType,
	MODULE_INFORMATION,
} from './Type';

// ------------------------------------------------

function ModuleCard(props: {
	title: string;
	version: string;
	description: string;
	onClickLaunch: () => void;
}) {
	const { title, version, description, onClickLaunch } = props;
	return (
		<MCard sx={{ width: 256 }}>
			<MCardContent>
				<MTypography variant='h5' component='div'>
					{title}
				</MTypography>
				<MTypography sx={{ mb: 1.5 }} color='text.secondary'>
					{version}
				</MTypography>
				<MTypography variant='body2'>
					{description}
				</MTypography>
			</MCardContent>
			<MCardActions>
				<MButton onClick={onClickLaunch}>Launch</MButton>
			</MCardActions>
		</MCard>
	);
}

function HomePage(props: {
	appendTab: (type: ModuleType) => void;
	toggleToLastTab: () => void;
}) {
	const { appendTab, toggleToLastTab } = props;
	return (
		<MBox sx={{ width: 1, height: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center' }}>
			{Object.keys(MODULE_INFORMATION).map((e, i) => (
				<MBox key={i}>
					<ModuleCard {...MODULE_INFORMATION[e as keyof typeof MODULE_INFORMATION]}
						onClickLaunch={() => {
							appendTab(e as ModuleType);
							toggleToLastTab();
						}}
					/>
				</MBox>
			))}
		</MBox>
	);
}

// ------------------------------------------------

export { HomePage };