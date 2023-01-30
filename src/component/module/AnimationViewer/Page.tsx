import {
	useLayoutEffect,
	useMemo,
} from 'react';

import {
	Paper as MPaper,
	Stack as MStack,
} from '@mui/material';

import {
	StageContext,
	useStage,
} from './StageContext';
import {
	SpriteListPanel,
} from './SpriteListPanel';
import {
	FrameLabelPanel,
} from './FrameLabelPanel';
import {
	Stage,
} from './Stage';
import {
	FrameStatePanel,
} from './FrameStatePanel';
import {
	SourcePanel,
} from './SourcePanel';

// ------------------------------------------------

function Page(props: {
}) {
	const context = useStage();
	const element = useMemo(() => (
		void console.log(`render Page`) ||
		<MStack direction='row' spacing={2} sx={{ width: 1, height: 1, p: 2 }}>
			<MPaper elevation={1} square sx={{ height: 1, width: 304 }}>
				<SourcePanel />
			</MPaper>
			<MStack direction='column' spacing={2} sx={{ height: 1, width: 0, flexGrow: 1 }}>
				<MPaper elevation={1} square sx={{ width: 1, height: 0, flexGrow: 1 }}>
					<Stage />
				</MPaper>
				<MPaper elevation={1} square sx={{ width: 1 }}>
					<FrameStatePanel />
				</MPaper>
			</MStack>
			<MStack direction='column' spacing={2} sx={{ height: 1, width: 304 }}>
				<MPaper elevation={1} square sx={{ height: 0, width: 1, flexGrow: 1 }}>
					<SpriteListPanel />
				</MPaper>
				<MPaper elevation={1} square sx={{ maxHeight: 0.4, width: 1 }}>
					<FrameLabelPanel />
				</MPaper>
			</MStack>
		</MStack>
	), []);
	const targetSprite = context.data === null ? null : context.data.target === null ? context.data.source.main_sprite : context.data.source.sprite[context.data.target];
	useLayoutEffect(() => {
		context.setState(targetSprite === null
			? {
				...context.state,
				frameRange: [-1, -1],
				frameRate: -1,
				pause: false,
			}
			: {
				...context.state,
				frameRange: [0, targetSprite.frame_count - 1],
				frameRate: targetSprite.frame_rate,
				pause: false,
			});
	}, [targetSprite]);
	return (
		<StageContext.Provider value={context}>
			{element}
		</StageContext.Provider>
	);
}

// ------------------------------------------------

export { Page };