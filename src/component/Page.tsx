import {
	useContext,
	useMemo,
} from 'react';

import {
	Paper as MPaper,
	Divider as MDivider,
	Stack as MStack,
} from '@mui/material';

import {
	useValue,
} from '../common/utility/Hook';
import {
	HomePage,
} from './module/HomePage';
import {
	ModuleType,
} from './module/Type';

import {
	Page as AnimationViewerPage,
} from './module/AnimationViewer/Page';

import {
	TabBar,
} from './TabBar';

import {
	TabPanel,
} from '../common/component/TabPanel';
import { MyThemeContext } from '../common/my-theme/Context';
import { MessengerContext, useMessenger } from '../common/context/Messenger';

// ------------------------------------------------

function Page(props: {
}) {
	const messenger = useMessenger();
	const tabPage = useValue<[ModuleType, React.ReactElement][]>([]);
	const appendTab = useMemo(() => (type: ModuleType) => {
		let newPage: React.ReactElement;
		switch (type) {
			case ModuleType.AnimationViewer:
				newPage = (<AnimationViewerPage />);
				break;
		}
		tabPage.setValue([...tabPage.value, [type, newPage]]);
	}, [tabPage.value]);
	const homePage = useMemo(() => (
		<HomePage appendTab={appendTab} toggleToLastTab={() => { tabIndex.setValue(tabPage.value.length); }} />
	), [tabPage.value, appendTab]);
	const tabIndex = useValue(0);
	return (
		<MessengerContext.Provider value={messenger}>
			{messenger.backdrop.element}
			{/* {messenger.snackbar.element} */}
			<MStack direction='row-reverse' sx={{ width: 1, height: 1 }}>
				<MPaper elevation={0} square sx={{ height: 1, width: 0, flexGrow: 1, overflow: 'hidden' }}>
					{[homePage, ...tabPage.value.map((e) => (e[1]))].map((e, i) => (
						<TabPanel key={i} value={i} current={tabIndex.value}>
							{e}
						</TabPanel>
					))}
				</MPaper>
				<MPaper elevation={4} square sx={{ height: 1 }}>
					<TabBar
						direction='column'
						openedTab={tabPage.value.map((e) => ({ type: e[0] }))}
						currentTab={tabIndex.value} toggleTab={tabIndex.setValue}
					/>
				</MPaper>
			</MStack>
		</MessengerContext.Provider>
	);
}

// ------------------------------------------------

export { Page };