import React, {
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import {
	Typography as MTypography,
	Divider as MDivider,
	IconButton as MIconButton,
	List as MList,
	ListItem as MListItem,
	ListItemButton as MListItemButton,
	ListItemText as MListItemText,
	Stack as MStack,
	Paper as MPaper,
	Collapse as MCollapse,
} from '@mui/material';

import {
	BookmarkBorderOutlined as MBookmarkBorderOutlinedIcon,
	PlayArrowOutlined as MPlayArrowOutlinedIcon,
	KeyboardArrowUpOutlined as MKeyboardArrowUpOutlinedIcon,
	KeyboardArrowDownOutlined as MKeyboardArrowDownOutlinedIcon,
} from '@mui/icons-material';

import {
	StageContext,
} from './StageContext';

import {
	useValue,
	useOpenLogic,
} from '../../../common/utility/Hook';

// ------------------------------------------------

function FrameLabelItem(props: {
	index: number;
	data: {
		label: string;
		range: [number, number];
	};
}) {
	const { index, data } = props;
	const context = useContext(StageContext);
	const selected = context.state.frameRange[0] <= data.range[0] && context.state.frameRange[1] >= data.range[1];
	return useMemo(() => (
		void console.log(`render FrameLabelItem ${index}`) ||
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={
					<MIconButton size='small' edge='end'>
						<MPlayArrowOutlinedIcon fontSize='inherit' />
					</MIconButton>
				}
				sx={{
					mt: 0.5,
					'&>.MuiListItemSecondaryAction-root': {
						pointerEvents: 'none',
					},
				}}>
				<MListItemButton
					selected={selected}
					onClick={() => {
						context.setStateFrameRange(data.range);
					}}>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							<MTypography variant='body2' color='text.primary' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
								{data.label}
							</MTypography>
							<MTypography variant='caption' color='text.secondary' sx={{ flexShrink: 0 }}>
								{`${data.range[0] + 1} ~ ${data.range[1] + 1}`}
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItemButton>
			</MListItem>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [index, data, selected]);
}

function FrameLabelPanel(props: {
}) {
	const context = useContext(StageContext);
	const targetSprite = context.data === null ? null : context.data.target === null ? context.data.source.main_sprite : context.data.source.sprite[context.data.target];
	const frameLabelRange = useMemo(() => {
		if (targetSprite === null) {
			return null;
		}
		let result: {
			label: string;
			range: [number, number];
		}[] = [];
		for (let label in targetSprite.frame_label) {
			let index = targetSprite.frame_label[label];
			let end_index = targetSprite.frame_stop.find((e) => (e >= index));
			if (end_index === undefined) {
				end_index = targetSprite.frame_count - 1;
			}
			result.push({
				label: label,
				range: [index, end_index],
			});
		}
		return result;
	}, [targetSprite]);
	const open = useOpenLogic(true);
	const headerElement = useMemo(() => (
		<MListItem
			secondaryAction={
				<MIconButton size='small' onClick={open.toggle}>
					{open.state
						? <MKeyboardArrowDownOutlinedIcon />
						: <MKeyboardArrowUpOutlinedIcon />
					}
				</MIconButton>
			}>
			<MListItemText>
				<MStack direction='row' alignItems='center' spacing={1}>
					<MBookmarkBorderOutlinedIcon sx={{ ml: -0.5 }} />
					<MTypography variant='subtitle1' sx={{ flexGrow: 1 }}>
						Frame Label
					</MTypography>
				</MStack>
			</MListItemText>
		</MListItem>
	), [open.state]);
	const collapseElementHeight = useValue('0px');
	const collapseElementRef = useRef<HTMLElement>(undefined as any);
	useLayoutEffect(() => {
		const dom = collapseElementRef.current.children.item(0)!;
		let height = window.getComputedStyle(dom).height;
		collapseElementHeight.setValue(height);
	}, [frameLabelRange]);
	return useMemo(() => (
		void console.log(`render FrameLabelPanel`) ||
		<MStack direction='column' sx={{ width: 1, height: 1 }}>
			<MPaper elevation={2} square sx={{ flexShrink: 0, overflow: 'hidden scroll' }}>
				{headerElement}
			</MPaper>
			<MCollapse ref={collapseElementRef} timeout={'auto'} in={open.state} sx={{
				width: 1,
				height: open.state ? `${collapseElementHeight.value}!important` : undefined,
				overflow: 'hidden scroll',
			}}>
				<MList disablePadding>
					{frameLabelRange?.map((e, i) => (
						<FrameLabelItem key={i} index={i} data={e} />
					))}
				</MList>
			</MCollapse>
		</MStack>
	), [frameLabelRange, open.state, collapseElementHeight.value]);
}

// ------------------------------------------------

export { FrameLabelPanel };