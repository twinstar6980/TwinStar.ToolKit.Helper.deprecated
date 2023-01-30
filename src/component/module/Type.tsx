import {
	AnimationOutlined as MAnimationOutlinedIcon,
	MapOutlined as MMapOutlinedIcon,
	ListAltOutlined as MListAltOutlinedIcon,
} from '@mui/icons-material';

// ------------------------------------------------

export enum ModuleType {
	AnimationViewer = 'AnimationViewer',
}

export const MODULE_INFORMATION = {
	'AnimationViewer': {
		version: '0.0.0',
		title: 'Animation Viewer',
		description: '动画查看',
		icon: <MAnimationOutlinedIcon />,
	},
}
