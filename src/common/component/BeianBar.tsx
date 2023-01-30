import {
	Stack as MStack,
	Typography as MTypography,
	Link as MLink,
} from '@mui/material';

// ------------------------------------------------

function BeianBar(props: {
	icp: string;
	gab: string;
}) {
	const { icp, gab } = props;
	return (
		<MStack direction='row' justifyContent='space-evenly' alignItems='center' sx={{ px: 1, py: 2 }}>
			<MTypography variant='subtitle1'>
				<MLink href='https://beian.miit.gov.cn/' target='_blank'>{icp}</MLink>
			</MTypography>
			<MTypography variant='subtitle1'>
				<MLink href='' target='_blank'>{gab}</MLink>
			</MTypography>
		</MStack>
	);
}

// ------------------------------------------------

export { BeianBar };