import {
	useContext,
} from 'react';

import {
	Box as MBox,
	Typography as MTypography,
	Tabs as MTabs,
	Tab as MTab,
	Divider as MDivider,
	IconButton as MIconButton,
	Stack as MStack,
} from '@mui/material';

import {
	Brightness4Outlined as MBrightness4OutlinedIcon,
	Brightness7Outlined as MBrightness7OutlinedIcon,
	AppsOutlined as MAppsOutlinedIcon,
	InfoOutlined as MInfoOutlinedIcon,
	SettingsOutlined as MSettingsOutlinedIcon,
} from '@mui/icons-material';

import {
	MyThemeContext,
} from '../common/my-theme/Context';

import {
	useOpenLogic, useValue,
} from '../common/utility/Hook';

import {
	AboutDialog,
} from './AboutDialog';
import { ModuleType, MODULE_INFORMATION } from './module/Type';
import React from 'react';

// ------------------------------------------------

function TabBar(props: {
	direction: 'row' | 'column';
	openedTab: {
		type: ModuleType;
	}[];
	currentTab: number;
	toggleTab: (index: number) => void;
}) {
	const { direction, openedTab, currentTab, toggleTab } = props;
	const orientation = direction === 'row' ? 'horizontal' : 'vertical';
	const orientationReverse = direction === 'row' ? 'vertical' : 'horizontal';
	const myTheme = useContext(MyThemeContext);
	const aboutDialog = useOpenLogic(false);
	return (
		<React.Fragment>
			<AboutDialog open={aboutDialog.state} onClose={aboutDialog.close} />
			<MStack direction={direction} alignItems='center' spacing={1}
				divider={<MDivider orientation={orientationReverse} flexItem />}
				sx={{ width: 1, height: 1, ...(direction === 'row' ? { px: 1 } : { py: 1 }) }}
			>
				<MTabs value={currentTab === 0 ? currentTab : false} orientation={orientation}>
					<MTab value={0} icon={<MAppsOutlinedIcon />} sx={{ minWidth: 48 }} onClick={() => { toggleTab(0); }} />
				</MTabs>
				<MTabs value={currentTab !== 0 ? currentTab : false} orientation={orientation} variant='scrollable' sx={{ flexGrow: 1 }}>
					{openedTab.map((e, i) => (
						<MTab key={i} value={i + 1} icon={MODULE_INFORMATION[e.type].icon} sx={{ minWidth: 48 }} onClick={() => { toggleTab(i + 1); }} />
					))}
				</MTabs>
				<MStack direction={direction}>
					<MIconButton onClick={aboutDialog.open}>
						<MInfoOutlinedIcon />
					</MIconButton>
					<MIconButton onClick={myTheme.toggleMode}>
						{myTheme.value.palette.mode === 'light'
							? <MBrightness7OutlinedIcon />
							: <MBrightness4OutlinedIcon />
						}
					</MIconButton>
					<MIconButton>
						<MSettingsOutlinedIcon />
					</MIconButton>
				</MStack>
			</MStack>
		</React.Fragment>
	);
}

// ------------------------------------------------

export { TabBar };