import { PvZ2AnimationComputedInformation as ComputedInformation } from './ComputedInformation';

namespace PvZ2AnimationLoader {

	export const COMMON_STYLE = `\
[_pvz2-anim]>img {
	position: absolute;
	animation-timing-function: step-end;
	animation-iteration-count: infinite;
}\
`;

	function createImageElement(
		index: number,
		layerID: string,
	): string {
		return `<img _l='${layerID}' _s='${index}' />`;
	}

	function createImageStyle(
		animationName: string,
		index: number,
		size: [number, number],
		transform: [number, number, number, number, number, number],
		source: string,
		directory: string,
	): string {
		return `\
[_pvz2-anim='${animationName}']>img[_s='${index}'] {
	width: ${size[0] * transform[0]}px;
	height: ${size[1] * transform[3]}px;
	transform-origin: ${-transform[4]}px ${-transform[5]}px;
	content: url('${`${directory}/${source}`.replaceAll('\\', '/')}.png');
}\
`;
	}

	function createLayerStyle(
		animationName: string,
		id: string,
		frameList: ComputedInformation.Frame[],
		range: [number, number],
		globalRange: [number, number],
		imageTranslate: [number, number],
	) {
		function createKeyFrameStyle(
			progress: number,
			transform: [number, number, number, number, number, number],
			opacity: number,
		) {
			return `\
${progress.toFixed(6)}% {
	transform: matrix(${transform[0]}, ${transform[1]}, ${transform[2]}, ${transform[3]}, ${transform[4] + imageTranslate[0]}, ${transform[5] + imageTranslate[1]});
	opacity: ${opacity};
}
`;
		}
		let frameCount = globalRange[1] - globalRange[0] + 1;
		let keyframeID = `${animationName}${id}`;
		let result = `\
[_pvz2-anim='${animationName}']>img[_l='${id}'] {
	animation-name: ${keyframeID};
}
@keyframes ${keyframeID} {
`;
		let diffCount = range[0] - globalRange[0];
		let diffCountReverse = globalRange[1] - range[1];
		if (diffCount > 0) {
			result += `\
0.000000% {
	opacity: 0.0;
}
`;
		}
		if (diffCount > 1) {
			result += `\
${(diffCount / frameCount * 100).toFixed(6)}% {
	opacity: 0.0;
}
`;
		}
		let i: number;
		for (i = diffCount < 0 ? -diffCount : 0; (range[0] + i) <= globalRange[1] && (range[0] + i) <= range[1]; ++i) {
			result += createKeyFrameStyle((diffCount + i) / frameCount * 100, frameList[i].transform, frameList[i].color[3]);
		}
		if (diffCountReverse > 0) {
			result += `\
${((diffCount + i) / frameCount * 100).toFixed(6)}% {
	opacity: 0.0;
}
`;
		}
		result += `\
100% {
	opacity: 0.0;
}
`;
		result += `}`;
		return result;
	}

	export function createImageStyleList(
		animationName: string,
		image: ComputedInformation.Image[],
		directory: string,
	): string {
		return image.map((e, i) => (
			createImageStyle(animationName, i, e.size, e.transform, e.source, directory)
		)).join('\n');
	}

	export function createSpriteStyleAndImageElement(
		animationName: string,
		image: ComputedInformation.Image[],
		layer: Record<string, ComputedInformation.Layer>,
		range: [number, number],
		filter: {
			image: boolean[];
			sprite: boolean[];
		},
	): {
		element: string,
		style: string,
	} {
		let element: string[] = [];
		let style: string[] = [];
		for (let index in layer) {
			let e = layer[index];
			if (!filter.image[e.image]) {
				continue;
			}
			if (e.sprite.some((e) => (!filter.sprite[e]))) {
				continue;
			}
			if (!(e.work_area[0] > range[1] || e.work_area[0] + e.work_area[1] - 1 < range[0])) {
				style.push(createLayerStyle(animationName, index, e.frame, [e.work_area[0], e.work_area[0] + e.work_area[1] - 1], range, [image[e.image].transform[4], image[e.image].transform[5]]));
				element.push(createImageElement(e.image, index));
			}
		}
		return {
			element: element.join('\n'),
			style: style.join('\n'),
		};
	}

	export function createSpriteDurationStyle(
		animationName: string,
		frameCount: number,
		frameRate: number,
	) {
		return `\
[_pvz2-anim='${animationName}']>img {
	animation-duration: ${frameCount / frameRate}s;
}\
`;
	}

	export function createSpritePlayStateStyle(
		animationName: null | string,
		running: boolean,
	) {
		return `\
[_pvz2-anim${animationName === null ? `` : `='${animationName}'`}]>img {
	animation-play-state: ${running ? 'running' : 'paused'};
}\
`;
	}

}

export { PvZ2AnimationLoader };