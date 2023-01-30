import React, {
	useContext,
	useMemo,
} from 'react';

import {
	Box as MBox,
	Typography as MTypography,
	Divider as MDivider,
	Checkbox as MCheckbox,
	List as MList,
	ListItem as MListItem,
	ListItemButton as MListItemButton,
	ListItemText as MListItemText,
	Stack as MStack,
	Paper as MPaper,
} from '@mui/material';

import {
	AnimationOutlined as MAnimationOutlinedIcon,
} from '@mui/icons-material';

import {
	DataContext,
} from './DataContext';

import {
	PvZ2AnimationComputedInformation,
} from '../../../common/PvZ2Animation/ComputedInformation';

// ------------------------------------------------

function ResourceListItem(props: {
	index: null | number;
	label: null | string;
}) {
	const selected = true;
	return useMemo(() => (
		void console.log(`render ProjectListItem ${props.index}`) ||
		<React.Fragment>
			<MListItem disablePadding
				sx={{ mt: 0.5 }}>
				<MListItemButton selected={selected} onClick={() => {
					//stage.setDataTarget(props.index);
				}}>
					<MListItemText>
						<MStack direction='column'>
							<MStack direction='row' alignItems='center' spacing={1}>
								<MTypography variant='caption' align='center' sx={{ width: '1.5em', flexShrink: 0 }}>
									{props.index === null ? '' : props.index + 1}
								</MTypography>
								<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
									{props.label === null ? '<main>' : props.label.length === 0 ? '<unlabeled>' : props.label}
								</MTypography>
							</MStack>
							<MStack direction='row' alignItems='center' spacing={1}>
								<MBox sx={{ ml: '1.5em' }}>
								</MBox>
							</MStack>
						</MStack>
					</MListItemText>
				</MListItemButton>
			</MListItem>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), []);
}

function ResourceListPanel(props: {
}) {
	const data = useContext(DataContext);
	return useMemo(() => (
		void console.log(`render PacakegListPanel`) ||
		<MStack direction='column' sx={{ width: 1, height: 1 }}>
			<MPaper elevation={2} square sx={{ flexShrink: 0, overflow: 'hidden scroll' }}>
				<MListItem>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							<MAnimationOutlinedIcon sx={{ ml: -0.5 }} />
							<MTypography variant='subtitle1' sx={{ flexGrow: 1 }}>
								Resource
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItem>
			</MPaper>
			<MBox sx={{ width: 1, height: 0, flexGrow: 1, overflow: 'hidden scroll' }}>
				<MList disablePadding>

				</MList>
			</MBox>
		</MStack>
	), []);
}

// ------------------------------------------------

export { ResourceListPanel };