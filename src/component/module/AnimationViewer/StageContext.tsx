import {
	createContext,
	useMemo,
} from 'react';

import {
	useFormValue,
	useValue,
} from '../../../common/utility/Hook';

import {
	PvZ2AnimationComputedInformation,
} from '../../../common/PvZ2Animation/ComputedInformation';

// ------------------------------------------------

type StageContextType = {
	data: null | {
		source: PvZ2AnimationComputedInformation.Animation;
		target: null | number;
		filter: {
			image: boolean[];
			sprite: boolean[];
		};
	};
	state: {
		imageDirectory: string;
		scale: number;
		frameRange: [number, number];
		frameRate: number;
		pause: boolean;
	};

	setDataSource: (value: Exclude<StageContextType['data'], null>['source'] | null) => void;
	setDataTarget: (value: Exclude<StageContextType['data'], null>['target']) => void;
	setDataFilterImage: (value: Exclude<StageContextType['data'], null>['filter']['image']) => void;
	setDataFilterSprite: (value: Exclude<StageContextType['data'], null>['filter']['sprite']) => void;

	setState: (value: StageContextType['state']) => void;
	setStateImageDirectory: (value: StageContextType['state']['imageDirectory']) => void;
	setStateScale: (value: StageContextType['state']['scale']) => void;
	setStateFrameRange: (value: Exclude<StageContextType['state'], null>['frameRange']) => void;
	setStateFrameRate: (value: Exclude<StageContextType['state'], null>['frameRate']) => void;
	setStatePause: (value: Exclude<StageContextType['state'], null>['pause']) => void;
};

const StageContext = createContext<StageContextType>(undefined as any);

// ------------------------------------------------

function useStage(
): StageContextType {
	const data = useValue<StageContextType['data']>(null);
	const state = useFormValue<StageContextType['state']>({
		imageDirectory: '',
		scale: 1.0,
		frameRange: [0, 0],
		frameRate: 0,
		pause: false,
	});
	const setDataItem = useMemo(() => (key: keyof Exclude<typeof data.value, null>, value: any) => {
		data.setValue({
			...data.value!,
			[key]: value,
		});
	}, []);
	const setDataSource = useMemo((): StageContextType['setDataSource'] => (value) => {
		data.setValue(value === null ? null : {
			source: value,
			target: null,
			filter: {
				image: new Array(value.image.length).fill(true),
				sprite: new Array(value.sprite.length).fill(true),
			},
		});
	}, []);
	const setDataTarget = useMemo((): StageContextType['setDataTarget'] => (value) => {
		setDataItem('target', value);
	}, []);
	const setDataFilterImage = useMemo((): StageContextType['setDataFilterImage'] => (value) => {
		setDataItem('filter', {
			image: value,
			sprite: data.value!.filter.sprite,
		});
	}, []);
	const setDataFilterSprite = useMemo((): StageContextType['setDataFilterSprite'] => (value) => {
		setDataItem('filter', {
			image: data.value!.filter.image,
			sprite: value,
		});
	}, []);
	const setStateImageDirectory = useMemo((): StageContextType['setStateImageDirectory'] => (value) => {
		state.setItem('imageDirectory', value);
	}, []);
	const setStateScale = useMemo((): StageContextType['setStateScale'] => (value) => {
		state.setItem('scale', value);
	}, []);
	const setStateFrameRate = useMemo((): StageContextType['setStateFrameRate'] => (value) => {
		state.setItem('frameRate', value);
	}, []);
	const setStateFrameRange = useMemo((): StageContextType['setStateFrameRange'] => (value) => {
		state.setItem('frameRange', value);
	}, []);
	const setStatePause = useMemo((): StageContextType['setStatePause'] => (value) => {
		state.setItem('pause', value);
	}, []);
	return {
		get data() { return data.value; },
		get state() { return state.value; },
		setDataSource,
		setDataTarget,
		setDataFilterImage,
		setDataFilterSprite,
		setState: state.setValue,
		setStateImageDirectory,
		setStateScale,
		setStateFrameRate,
		setStateFrameRange,
		setStatePause,
	};
}

// ------------------------------------------------

export { StageContext, useStage };