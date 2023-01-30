import React, {useContext, useLayoutEffect, useMemo, useRef,} from 'react';

import {
    Box as MBox,
    Fade as MFade,
    IconButton as MIconButton,
    Paper as MPaper,
    Popper as MPopper,
    Slider as MSlider,
    Stack as MStack,
} from '@mui/material';

import {
    PauseOutlined as MPauseOutlinedIcon,
    PlayArrowOutlined as MPlayArrowOutlinedIcon,
    SyncOutlined as MSyncOutlinedIcon,
    ZoomInOutlined as MZoomInOutlinedIcon,
} from '@mui/icons-material';

import {StageContext,} from './StageContext';

import {PvZ2AnimationLoader,} from '../../../common/PvZ2Animation/Loader';

import {useOpenLogic, useValue,} from '../../../common/utility/Hook';

// ------------------------------------------------

const STAGE_WIDTH = 4000;
const STAGE_HEIGHT = 4000;
const ANIMATION_NAME = 'main';

function computeScaleValue(
	value: number,
): number {
	return Number((value <= 10 ? (0.2 + value / 10 * 0.8) : (1 + (value - 10) / 10 * 4)).toFixed(2));
}

function StageController(props: {
}) {
	const context = useContext(StageContext);
	const disabledStateControl = context.data === null;
	const openScalePopper = useOpenLogic(false);
	const scaleAnchorElement = useRef<HTMLButtonElement>(undefined as any);
	const scaleValueProto = useValue(10.0);
	return useMemo(() => (
		<React.Fragment>
			<MStack direction='row' spacing={1}>
				<MIconButton size='medium' disabled={disabledStateControl}>
					<MSyncOutlinedIcon fontSize='inherit' />
				</MIconButton>
				<MIconButton size='medium' disabled={disabledStateControl} onClick={() => { context.setStatePause(!context.state.pause); }}>
					{context.state.pause ?
						<MPlayArrowOutlinedIcon fontSize='inherit' />
						:
						<MPauseOutlinedIcon fontSize='inherit' />
					}
				</MIconButton>
				<MIconButton ref={scaleAnchorElement} size='medium' onClick={openScalePopper.toggle}>
					<MZoomInOutlinedIcon fontSize='inherit' />
				</MIconButton>
			</MStack>
			<MPopper open={openScalePopper.state} anchorEl={scaleAnchorElement.current} placement='top' transition onResize={null} onResizeCapture={null}>
				{({ TransitionProps }) => (
					<MFade {...TransitionProps} timeout={400}>
						<MPaper elevation={3} sx={{ p: 1 }}>
							<MBox>
								<MSlider
									orientation='vertical'
									size='small'
									min={0}
									max={20}
									step={0.01}
									track={false}
									value={scaleValueProto.value}
									valueLabelDisplay='on'
									valueLabelFormat={(value) => (`${Math.round(computeScaleValue(value) * 100)} %`)}
									onChange={(event, value) => {
										scaleValueProto.setValue(value as number);
										context.setStateScale(computeScaleValue(value as number));
									}}
									sx={{ height: '192px', my: 1 }}
								/>
							</MBox>
						</MPaper>
					</MFade>
				)}
			</MPopper>
		</React.Fragment>
	), [context.state.pause, context.state.scale, openScalePopper.state, disabledStateControl]);
}

function StageContent(props: {
}) {
	const context = useContext(StageContext);
	const prevScale = useValue(1.0);
	useLayoutEffect(() => {
		const f = () => {};
		window.addEventListener('keydown', () => {});
	}, []);
	useLayoutEffect(() => {
		console.log('init scale');
		const element = stageElementDOM.current.parentElement!.parentElement!;
		const computedStyle = window.getComputedStyle(element);
		const centerPosition = [
			Number(computedStyle.width.slice(0, -2)) / 2,
			Number(computedStyle.height.slice(0, -2)) / 2,
		];
		element.scrollLeft = STAGE_WIDTH / 2 - centerPosition[0];
		element.scrollTop = STAGE_HEIGHT / 2 - centerPosition[1];
	}, []);
	useLayoutEffect(() => {
		console.log('change scale');
		const element = stageElementDOM.current.parentElement!.parentElement!;
		const computedStyle = window.getComputedStyle(element);
		const centerPosition = [
			Number(computedStyle.width.slice(0, -2)) / 2,
			Number(computedStyle.height.slice(0, -2)) / 2,
		];
		stageElementDOM.current.parentElement!.style.transform = `scale(${context.state.scale})`;
		//element.scrollLeft = element.scrollLeft / prevScale.value * stage.state.scale;
		//element.scrollTop = element.scrollTop / prevScale.value * stage.state.scale;
		element.scrollLeft = -centerPosition[0] + ((element.scrollLeft + centerPosition[0]) / prevScale.value) * context.state.scale;
		element.scrollTop = -centerPosition[1] + ((element.scrollTop + centerPosition[1]) / prevScale.value) * context.state.scale;
		console.log(`x ${element.scrollLeft} , y ${element.scrollTop}`);
		prevScale.setValue(context.state.scale);
	}, [context.state.scale]);
	const targetSprite =  context.data === null ? null : context.data.target === null ? context.data.source.main_sprite : context.data.source.sprite[context.data.target];
	const stageElementDOM = useRef<HTMLDivElement>(undefined as any);
	useLayoutEffect(() => {
		console.log('generate image style');
		const element = stageElementDOM.current;
		let imageStyleElement = element.querySelector('#style-image')!;
		if (context.data !== null) {
            imageStyleElement.innerHTML = PvZ2AnimationLoader.createImageStyleList(ANIMATION_NAME, context.data.source.image, `file://${context.state.imageDirectory}`);
		} else {
            imageStyleElement.innerHTML = '';
		}
	}, [context.data?.source, context.state.imageDirectory]);
	useLayoutEffect(() => {
		console.log('generate sprite data');
		const element = stageElementDOM.current;
		let containerElement = element.querySelector('#container')!;
		let spriteStyleElement = element.querySelector('#style-sprite')!;
		if (context.data !== null) {
			let animationData = PvZ2AnimationLoader.createSpriteStyleAndImageElement(ANIMATION_NAME, context.data.source.image, targetSprite!.layer, context.state.frameRange, context.data.filter);
			containerElement.setAttribute('_pvz2-anim', ANIMATION_NAME);
			containerElement.innerHTML = animationData.element;
            spriteStyleElement.innerHTML = PvZ2AnimationLoader.COMMON_STYLE + '\n' + animationData.style;
		} else {
			containerElement.innerHTML = '';
            spriteStyleElement.innerHTML = '';
		}
	}, [targetSprite, context.data?.filter, context.state.frameRange]);
	useLayoutEffect(() => {
		console.log('change frame rate');
		const element = stageElementDOM.current;
		let durationStyleElement = element.querySelector('#style-duration')!;
		if (context.data !== null) {
			durationStyleElement.innerHTML = PvZ2AnimationLoader.createSpriteDurationStyle(ANIMATION_NAME, context.state.frameRange[1] - context.state.frameRange[0] + 1, context.state.frameRate);
		} else {
			durationStyleElement.innerHTML = '';
		}
	}, [targetSprite, context.state.frameRange, context.state.frameRate]);
	useLayoutEffect(() => {
		console.log('change play state');
		const element = stageElementDOM.current;
		let playStateStyleElement = element.querySelector('#style-play-state')!;
		if (context.data !== null) {
			playStateStyleElement.innerHTML = PvZ2AnimationLoader.createSpritePlayStateStyle(ANIMATION_NAME, !context.state.pause);
		} else {
			playStateStyleElement.innerHTML = '';
		}
	}, [targetSprite, context.state.pause]);
	return useMemo(() => (
		<MBox sx={{ position: 'absolute', width: STAGE_WIDTH, height: STAGE_HEIGHT, overflow: 'hidden', transformOrigin: '0% 0%' }}>
			<div ref={stageElementDOM} style={{ position: 'absolute', top: '50%', left: '50%', width: 0, height: 0, overflow: 'visible' }}>
				<div id='container' />
                <style id='style-image' />
				<style id='style-sprite' />
				<style id='style-duration' />
				<style id='style-play-state' />
			</div>
		</MBox>
	), []);
}

function Stage(props: {
}) {
	return useMemo(() => (
		void console.log(`render Stage`) ||
		<MBox sx={{ position: 'relative', width: 1, height: 1, overflow: 'hidden' }}>
			<MBox sx={{ position: 'absolute', width: 1, height: 1, overflow: 'scroll' }}>
				<StageContent />
			</MBox>
			<MBox sx={{ position: 'absolute', bottom: '8px', right: '8px' }}>
				<StageController />
			</MBox>
		</MBox>
	), []);
}

// ------------------------------------------------

export { Stage };