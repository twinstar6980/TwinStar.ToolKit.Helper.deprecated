namespace PvZ2AnimationComputedInformation {

	// ------------------------------------------------

	export type Transform = [number, number, number, number, number, number];

	export type Color = [number, number, number, number];

	export type Image = {
		source: string;
		size: [number, number];
		transform: Transform;
	};

	export type Frame = {
		transform: Transform;
		color: Color;
	};

	export type Layer = {
		image: number;
		sprite: number[];
		work_area: [number, number];
		frame: Frame[];
	};

	export type Sprite = {
		name: string;
		frame_rate: number;
		frame_count: number;
		frame_label: Record<string, number>;
		frame_stop: number[];
		layer: Record<string, Layer>;
	};

	export type Animation = {
		frame_rate: number;
		position: [number, number];
		size: [number, number];
		image: Image[];
		sprite: Sprite[];
		main_sprite: Sprite;
	};

	// ------------------------------------------------

}

export type { PvZ2AnimationComputedInformation };