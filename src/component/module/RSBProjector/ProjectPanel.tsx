import React, {
	createContext,
	useContext,
	useLayoutEffect,
	useMemo,
	useRef,
} from 'react';

import {
	Box as MBox,
	Typography as MTypography,
	Divider as MDivider,
	Checkbox as MCheckbox,
	List as MList,
	ListItem as MListItem,
	ListItemButton as MListItemButton,
	ListItemText as MListItemText,
	Stack as MStack,
	Paper as MPaper,
	IconButton as MIconButton,
	Collapse as MCollapse,
} from '@mui/material';

import {
	TreeView as MTreeView,
	TreeItem as MTreeItem,
} from '@mui/lab';

import {
	ExpandLessOutlined as MExpandLessOutlinedIcon,
	ExpandMoreOutlined as MExpandMoreOutlinedIcon,
	FormatListBulletedOutlined as MFormatListBulletedOutlinedIcon,
	AddOutlined as MAddOutlinedIcon,
} from '@mui/icons-material';

import {
	DataContext,
} from './DataContext';
import { useOpenLogic, useValue } from '../../../common/utility/Hook';

//import { FixedSizeList, ListChildComponentProps } from 'react-virtualized';
//import AutoSizer from 'react-virtualized-auto-sizer';
import { List as FixedSizeList, AutoSizer, WindowScroller } from 'react-virtualized';

// ------------------------------------------------

function ResourceItem(props: {
	projectID: string;
	moduleID: string;
	groupID: string;
	resourceIndex: number;
}) {
	const { projectID, moduleID, groupID, resourceIndex } = props;
	const context = useContext(DataContext);
	const data = context.solution!.project[projectID].module[moduleID].group[groupID].resource[resourceIndex];
	const openContent = useOpenLogic(true);
	return useMemo(() => (
		void console.log(`render ProjectItem`) ||
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={undefined}
				sx={{ mt: 0.5 }}>
				<MListItemButton
					selected={false}
					onClick={() => {
						openContent.toggle();
					}}>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							{openContent.state
								? <MExpandLessOutlinedIcon fontSize='small' />
								: <MExpandMoreOutlinedIcon fontSize='small' />
							}
							<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
								{data.path}
							</MTypography>
							<MTypography variant='caption' align='center' color='text.secondary'>
								{``}
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItemButton>
				<MDivider orientation='vertical' flexItem sx={{ my: 1 }} />
				<MBox sx={{ mx: 1 }}>
					<MIconButton size='small'>
						<MAddOutlinedIcon fontSize='inherit' />
					</MIconButton>
				</MBox>
			</MListItem>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [projectID, moduleID, groupID, openContent.state]);
}

function GroupItem(props: {
	projectID: string;
	moduleID: string;
	groupID: string;
	visible: boolean;
}) {
	const { projectID, moduleID, groupID, visible } = props;
	const context = useContext(DataContext);
	const data = context.solution!.project[projectID].module[moduleID].group[groupID];
	const openContent = useOpenLogic(false);
	const content = useMemo(() => (
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={undefined}
				sx={{ mt: 0.5 }}>
				<MListItemButton
					selected={false}
					onClick={() => {
						openContent.toggle();
					}}>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							{openContent.state
								? <MExpandLessOutlinedIcon fontSize='small' />
								: <MExpandMoreOutlinedIcon fontSize='small' />
							}
							<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
								{groupID}
							</MTypography>
							<MTypography variant='caption' align='center' color='text.secondary'>
								{`${Object.keys(data.resource).length}`}
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItemButton>
				<MDivider orientation='vertical' flexItem sx={{ my: 1 }} />
				<MBox sx={{ mx: 1 }}>
					<MIconButton size='small'>
						<MAddOutlinedIcon fontSize='inherit' />
					</MIconButton>
				</MBox>
			</MListItem>
			<MCollapse in={openContent.state}>
				<MStack direction='column' sx={{ mt: 0.5, ml: `${16 + 20 + 8 / 2}px` }}>
					<MDivider />
					<MBox sx={{ width: 1 }}>
						<MList disablePadding>
							{data.resource.map((e, i) => (
								null && <ResourceItem key={i} projectID={projectID} moduleID={moduleID} groupID={groupID} resourceIndex={i} />
							))}
						</MList>
					</MBox>
				</MStack>
			</MCollapse>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [projectID, moduleID, groupID, openContent.state]);
	return useMemo(() => (
		void console.log(`render GroupItem`) ||
		<React.Fragment>
			{!visible && <MBox sx={{ height: '53px' }} />}
			{visible && content }
		</React.Fragment>
	), [projectID, moduleID, groupID, openContent.state, visible]);
}

function ModuleItem(props: {
	projectID: string;
	moduleID: string;
}) {
	const { projectID, moduleID } = props;
	const context = useContext(DataContext);
	const data = context.solution!.project[projectID].module[moduleID];
	const openContent = useOpenLogic(true);

	const scrollContext = useContext(ScrollContext);

	const mainContent = useMemo(() => (
		<MListItem disablePadding
			secondaryAction={undefined}
			sx={{ mt: 0.5 }}>
			<MListItemButton
				selected={false}
				onClick={() => {
					openContent.toggle();
				}}>
				<MListItemText>
					<MStack direction='row' alignItems='center' spacing={1}>
						{openContent.state
							? <MExpandLessOutlinedIcon fontSize='small' />
							: <MExpandMoreOutlinedIcon fontSize='small' />
						}
						<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
							{moduleID}
						</MTypography>
						<MTypography variant='caption' align='center' color='text.secondary'>
							{`${Object.keys(data.group).length}`}
						</MTypography>
					</MStack>
				</MListItemText>
			</MListItemButton>
			<MDivider orientation='vertical' flexItem sx={{ my: 1 }} />
			<MBox sx={{ mx: 1 }}>
				<MIconButton size='small'>
					<MAddOutlinedIcon fontSize='inherit' />
				</MIconButton>
			</MBox>
		</MListItem>
	), [projectID, moduleID]);
	const collapseContent = useMemo(() => (
		<MStack direction='column' sx={{ mt: 0.5, ml: `${16 + 20 + 8 / 2}px` }}>
			<MDivider />
			<MBox sx={{ width: 1 }}>
				<MList disablePadding>
					{Object.keys(data.group).map((groupID, i) => (
						<GroupItem key={groupID} projectID={projectID} moduleID={moduleID} groupID={groupID} visible={scrollContext.top - 100 >= (i - 20) * 53 && scrollContext.top - 100 <= (i + 20) * 53} />
					))}
				</MList>
			</MBox>
		</MStack>
	), [projectID, moduleID, scrollContext.top]);

	return useMemo(() => (
		void console.log(`render ProjectItem`) ||
		<React.Fragment>
			{mainContent}
			<MCollapse in={openContent.state}>
				{collapseContent}
			</MCollapse>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [mainContent, collapseContent, openContent.state]);
}

function ProjectItem(props: {
	projectID: string;
}) {
	const { projectID } = props;
	const context = useContext(DataContext);
	const data = context.solution!.project[projectID];
	const openContent = useOpenLogic(true);
	return useMemo(() => (
		void console.log(`render ProjectItem`) ||
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={undefined}
				sx={{ mt: 0.5 }}>
				<MListItemButton
					selected={false}
					onClick={() => {
						openContent.toggle();
					}}>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							{openContent.state
								? <MExpandLessOutlinedIcon fontSize='small' />
								: <MExpandMoreOutlinedIcon fontSize='small' />
							}
							<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
								{projectID}
							</MTypography>
							<MTypography variant='caption' align='center' color='text.secondary'>
								{`${Object.keys(data.module).length}`}
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItemButton>
				<MDivider orientation='vertical' flexItem sx={{ my: 1 }} />
				<MBox sx={{ mx: 1 }}>
					<MIconButton size='small'>
						<MAddOutlinedIcon fontSize='inherit' />
					</MIconButton>
				</MBox>
			</MListItem>
			<MCollapse in={openContent.state}>
				<MStack direction='column' sx={{ mt: 0.5, ml: `${16 + 20 + 8 / 2}px` }}>
					<MDivider />
					<MBox sx={{ width: 1 }}>
						<MList disablePadding>
							{Object.keys(data.module).map((moduleID) => (
								<ModuleItem key={moduleID} projectID={projectID} moduleID={moduleID} />
							))}
						</MList>
					</MBox>
				</MStack>
			</MCollapse>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [projectID, openContent.state]);
}

function ProjectPanel(props: {
}) {
	const context = useContext(DataContext);
	const scrollContext = useScroll();
	const scrollWrapperRef = useRef<HTMLDivElement>(undefined as any);
	useLayoutEffect(() => {
		scrollWrapperRef.current.onscroll = (e) => {
			const t = e.target as HTMLDivElement;
			console.log(t.scrollTop);
			scrollContext.setTop(t.scrollTop);
		};
	}, []);
	const element = useMemo(() => (
		void console.log(`render ProjectPanel`) ||
		<MStack direction='column' sx={{ width: 1, height: 1 }}>
			<MPaper elevation={3} square sx={{ flexShrink: 0, overflow: 'hidden scroll' }}>
				<MListItem>
					<MListItemText>
						<MStack direction='row' alignItems='center' spacing={1}>
							<MExpandMoreOutlinedIcon sx={{ ml: -0.5 }} />
							<MTypography variant='subtitle1' sx={{ flexGrow: 1 }}>
								Project
							</MTypography>
						</MStack>
					</MListItemText>
				</MListItem>
			</MPaper>
			<MBox ref={scrollWrapperRef} sx={{ width: 1, height: 0, flexGrow: 1, overflow: 'hidden scroll' }}>
				<MList disablePadding>
					{context.solution !== null &&
						Object.keys(context.solution.project).map((projectID) => (
							<ProjectItem key={projectID} projectID={projectID} />
						))
					}
				</MList>
			</MBox>
		</MStack>
	), [context.solution]);
	return (
		<ScrollContext.Provider value={scrollContext}>
			{element}
		</ScrollContext.Provider>
	);
	// return useMemo(() => (
	// 	void console.log(`render ProjectPanel`) ||
	// 	<ScrollContext.Provider value={scrollContext}>
	// 		<MStack direction='column' sx={{ width: 1, height: 1 }}>
	// 			<MPaper elevation={3} square sx={{ flexShrink: 0, overflow: 'hidden scroll' }}>
	// 				<MListItem>
	// 					<MListItemText>
	// 						<MStack direction='row' alignItems='center' spacing={1}>
	// 							<MExpandMoreOutlinedIcon sx={{ ml: -0.5 }} />
	// 							<MTypography variant='subtitle1' sx={{ flexGrow: 1 }}>
	// 								Project
	// 							</MTypography>
	// 						</MStack>
	// 					</MListItemText>
	// 				</MListItem>
	// 			</MPaper>
	// 			<MBox ref={scrollWrapperRef} sx={{ width: 1, height: 0, flexGrow: 1, overflow: 'hidden scroll' }}>
	// 				<MList disablePadding>
	// 					{context.solution !== null &&
	// 						Object.keys(context.solution.project).map((projectID) => (
	// 							<ProjectItem key={projectID} projectID={projectID} />
	// 						))
	// 					}
	// 				</MList>
	// 			</MBox>
	// 		</MStack>
	// 	</ScrollContext.Provider>
	// ), [context.solution]);
}

type ScrollContextType = {
	top: number;
	setTop: (value: number) => void;
};

const ScrollContext = createContext<ScrollContextType>(undefined as any);

// ------------------------------------------------

function useScroll(
): ScrollContextType {
	const data = useValue<ScrollContextType['top']>(0);
	return {
		get top() { return data.value; },
		setTop: data.setValue,
	};
}

// ------------------------------------------------

export { ProjectPanel };