import {
	useContext,
	useMemo,
} from 'react';

import {
	Box as MBox,
	Divider as MDivider,
	TextField as MTextField,
	Stack as MStack,
	Slider as MSlider,
	InputAdornment as MInputAdornment,
} from '@mui/material';

import {
	StartOutlined as MStartOutlinedIcon,
	KeyboardTabOutlined as MKeyboardTabOutlinedIcon,
	AutofpsSelectOutlined as MAutofpsSelectOutlinedIcon,
} from '@mui/icons-material';

import {
	StageContext,
} from './StageContext';

import {
	useValue,
} from '../../../common/utility/Hook';

// ------------------------------------------------

function FrameRateController(props: {
}) {
	const context = useContext(StageContext);
	const targetSprite = context.data === null ? null : context.data.target === null ? context.data.source.main_sprite : context.data.source.sprite[context.data.target];
	const disabled = targetSprite === null;
	const tempValue = useValue(-1);
	useMemo(() => {
		tempValue.setValue(context.state.frameRate);
	}, [context.state.frameRate]);
	return useMemo(() => (
		void console.log(`render FrameRateController`) ||
		<MStack direction='row' spacing={4} sx={{ width: 1, height: 1 }}>
			<MTextField
				size='small'
				variant='outlined'
				label='frame rate'
				InputProps={{
					startAdornment: (
						<MInputAdornment position='start'>
							<MAutofpsSelectOutlinedIcon color={disabled ? 'disabled' : undefined} />
						</MInputAdornment>
					),
				}}
				sx={{ width: '6.5em', flexShrink: 0 }}
				inputProps={{
					type: 'number',
					min: 1,
					max: 60,
				}}
				{...(disabled
					? {
						disabled: true,
						value: '',
					}
					: {
						value: tempValue.value,
						onChange: (event) => {
							let value = Number.parseInt(event.target.value);
							tempValue.setValue(value);
						},
						onBlur: (event) => {
							context.setStateFrameRate(tempValue.value);
						},
					})
				}
			/>
		</MStack>
	), [targetSprite, tempValue.value]);
}

function FrameRangeController(props: {
}) {
	const context = useContext(StageContext);
	const targetSprite = context.data === null ? null : context.data.target === null ? context.data.source.main_sprite : context.data.source.sprite[context.data.target];
	const marks = useMemo(() => {
		if (targetSprite === null) {
			return null;
		}
		let bound = new Set<number>();
		let step = Math.ceil(targetSprite.frame_count / 10);
		let computeBound = (
			min: number,
			max: number,
		) => {
			if (min < max) {
				bound.add(min);
				bound.add(max);
				let diff = max - min;
				if (diff / 1.5 >= step) {
					let mid = Math.round(min + diff / 2);
					computeBound(min, mid);
					computeBound(mid, max);
				}
			}
		};
		computeBound(1, targetSprite.frame_count);
		return Array.from(bound).map((e) => ({
			label: `${e}`,
			value: e,
		}));
	}, [targetSprite]);
	const disabled = targetSprite === null;
	const tempValue = useValue<[number, number]>([-1, -1]);
	useMemo(() => {
		tempValue.setValue(context.state.frameRange);
	}, [context.state.frameRange]);
	return useMemo(() => (
		void console.log(`render FrameRangeController`) ||
		<MStack direction='row' spacing={4} sx={{ width: 1, height: 1 }}>
			<MTextField
				size='small'
				variant='outlined'
				label='beginning frame'
				InputProps={{
					startAdornment: (
						<MInputAdornment position='start'>
							<MStartOutlinedIcon color={disabled ? 'disabled' : undefined} />
						</MInputAdornment>
					),
				}}
				sx={{ width: '8.5em', flexShrink: 0 }}
				{...(disabled
					? {
						disabled: true,
						value: '',
					}
					: {
						inputProps: {
							type: 'number',
							min: 1,
							max: tempValue.value[1] + 1,
						},
						value: tempValue.value[0] + 1,
						onChange: (event) => {
							let value = Number.parseInt(event.target.value) - 1;
							tempValue.setValue([
								value,
								tempValue.value[1],
							]);
						},
						onBlur: () => {
							context.setStateFrameRange(tempValue.value);
						},
					})
				}
			/>
			<MSlider
				{...(disabled
					? {
						disabled: true,
						min: 0,
						max: 1,
						value: [0, 1],
					}
					: {
						min: 1,
						max: targetSprite.frame_count,
						value: [tempValue.value[0] + 1, tempValue.value[1] + 1],
						marks: marks!,
						valueLabelDisplay: 'auto',
						onChange: (event, value) => {
							tempValue.setValue([
								(value as number[])[0] - 1,
								(value as number[])[1] - 1,
							]);
						},
						onChangeCommitted: () => {
							context.setStateFrameRange(tempValue.value);
						},
					})
				}
			/>
			<MTextField
				size='small'
				variant='outlined'
				label='ending frame'
				InputProps={{
					startAdornment: (
						<MInputAdornment position='start'>
							<MKeyboardTabOutlinedIcon color={disabled ? 'disabled' : undefined} />
						</MInputAdornment>
					),
				}}
				sx={{ width: '8.5em', flexShrink: 0 }}
				{...(disabled
					? {
						disabled: true,
						value: '',
					}
					: {
						inputProps: {
							type: 'number',
							min: tempValue.value[0] + 1,
							max: targetSprite.frame_count,
						},
						value: tempValue.value[1] + 1,
						onChange: (event) => {
							let value = Number.parseInt(event.target.value) - 1;
							tempValue.setValue([
								tempValue.value[0],
								value,
							]);
						},
						onBlur: () => {
							context.setStateFrameRange(tempValue.value);
						},
					})
				}
			/>
		</MStack>
	), [targetSprite, tempValue.value]);
}

function FrameStatePanel(props: {
}) {
	return useMemo(() => (
		void console.log(`render FrameStatePanel`) ||
		<MStack direction='row' spacing={3} divider={<MDivider orientation='vertical' flexItem />} sx={{ width: 1, height: 1, p: 2 }}>
			<MBox>
				{<FrameRateController />}
			</MBox>
			<MBox sx={{ flexGrow: 1 }}>
				{<FrameRangeController />}
			</MBox>
		</MStack>
	), []);
}

// ------------------------------------------------

export { FrameStatePanel };