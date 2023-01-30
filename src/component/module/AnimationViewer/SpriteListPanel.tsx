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
	StageContext,
} from './StageContext';

import {
	PvZ2AnimationComputedInformation,
} from '../../../common/PvZ2Animation/ComputedInformation';

// ------------------------------------------------

function SpriteListItem(props: {
	index: null | number;
	name: null | string;
	data: PvZ2AnimationComputedInformation.Sprite;
}) {
	const { index, name, data } = props;
	const context = useContext(StageContext);
	const visible = index === null || context.data!.filter.sprite[index];
	const selected = index === context.data!.target;
	return useMemo(() => (
		void console.log(`render AnimationFilterPanel ${index}`) ||
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={index !== null &&
					<MCheckbox
						edge='end'
						checked={visible}
						onClick={() => {
							let newFilter = [...context.data!.filter.sprite];
							newFilter[index!] = !newFilter[index!];
							context.setDataFilterSprite(newFilter);
						}}
					/>
				}
				sx={{ mt: 0.5 }}>
				<MListItemButton
					selected={selected}
					onClick={() => {
						context.setDataTarget(index);
					}}>
					<MListItemText>
						<MStack direction='column'>
							<MStack direction='row' alignItems='center' spacing={1} sx={{ color: visible ? 'text.primary' : 'text.disabled' }}>
								<MTypography variant='caption' align='center' sx={{ width: '1.5em', flexShrink: 0 }}>
									{index === null ? '' : index + 1}
								</MTypography>
								<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
									{name === null ? '<main>' : name.length === 0 ? '<unnamed>' : name}
								</MTypography>
							</MStack>
							<MStack direction='row' alignItems='center' spacing={1} sx={{ color: visible ? 'text.secondary' : 'text.disabled' }}>
								<MBox sx={{ ml: '1.5em' }}>
								</MBox>
								<MTypography variant='caption'>
									{`${data.frame_count} / ${data.frame_rate}`}
								</MTypography>
							</MStack>
						</MStack>
					</MListItemText>
				</MListItemButton>
			</MListItem>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [index, name, data, visible, selected]);
}

function SpriteListPanel(props: {
}) {
	const context = useContext(StageContext);
	return useMemo(() => (
		void console.log(`render SpriteListPanel`) ||
		<MStack direction='column' sx={{ width: 1, height: 1 }}>
			<MPaper elevation={2} square sx={{ flexShrink: 0, overflow: 'hidden scroll' }}>
				<MListItem
					secondaryAction={
						<MCheckbox
							edge='end'
							{...(context.data === null
								? {
									disabled: true,
									indeterminate: true,
									checked: false,
								}
								: {
									indeterminate: context.data.filter.sprite.some((e, i, array) => (e !== array[0])),
									checked: context.data.filter.sprite.every((e) => (e)),
									onChange: (event) => {
										let value = event.target.indeterminate || event.target.checked;
										let newFilter = new Array<boolean>(context.data!.filter.sprite.length);
										newFilter.fill(value);
										context.setDataFilterSprite(newFilter);
									},
								})
							}
						/>
					}>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							<MAnimationOutlinedIcon sx={{ ml: -0.5 }} />
							<MTypography variant='subtitle1' sx={{ flexGrow: 1 }}>
								Sprite
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItem>
			</MPaper>
			<MBox sx={{ width: 1, height: 0, flexGrow: 1, overflow: 'hidden scroll' }}>
				<MList disablePadding>
					{context.data !== null && (
						<React.Fragment>
							<SpriteListItem index={null} name={null} data={context.data.source.main_sprite} />
							{context.data.source.sprite.map((e, i) => (
								<SpriteListItem key={i} index={i} name={e.name} data={e} />
							))}
						</React.Fragment>
					)}
				</MList>
			</MBox>
		</MStack>
	), [context.data?.source, context.data?.filter.sprite]);
}

// ------------------------------------------------

export { SpriteListPanel };