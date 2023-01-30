import React, {
	useContext,
	useLayoutEffect,
	useMemo,
} from 'react';

import {
	Box as MBox,
	Button as MButton,
	Typography as MTypography,
	IconButton as MIconButton,
	Divider as MDivider,
	List as MList,
	ListItem as MListItem,
	ListItemButton as MListItemButton,
	ListItemText as MListItemText,
	TextField as MTextField,
	Stack as MStack,
	Tooltip as MTooltip,
	CircularProgress as MCircularProgress,
} from '@mui/material';

import {
	BrokenImageOutlined as MBrokenImageOutlinedIcon,
	ClearAllOutlined as MClearAllOutlinedIcon,
	FolderSpecialOutlined as MFolderSpecialOutlinedIcon,
	ImageOutlined as MImageOutlinedIcon,
	FileUploadOutlined as MFileUploadOutlinedIcon,
	DriveFolderUploadOutlined as MDriveFolderUploadOutlinedIcon,
	ErrorOutlineOutlined as MErrorOutlineOutlinedIcon,
} from '@mui/icons-material';

import {
	useOpenLogic,
	useValue,
} from '../../../common/utility/Hook';
import {
	FileSystemUtility,
} from '../../../common/utility/FileSystem';
import {
	setTimeout,
} from '../../../common/utility/Timer';
import {
	MessengerContext,
} from '../../../common/context/Messenger';

import {
	StageContext,
} from './StageContext';

import {
	PvZ2AnimationComputedInformation,
} from '../../../common/PvZ2Animation/ComputedInformation';

// ------------------------------------------------

function SourceController(props: {
}) {
	const messenger = useContext(MessengerContext);
	const context = useContext(StageContext);
	const disabledClearButton = context.data === null;
	const openSelectDialog = useOpenLogic(false);
	return useMemo(() => (
		void console.log(`render SourceController`) ||
		<MStack direction='row' alignItems='center' spacing={1}>
			<MButton variant='outlined' sx={{ flexGrow: 1 }}
				disabled={openSelectDialog.state}
				endIcon={openSelectDialog.state
					? <MCircularProgress color='inherit' size={16} />
					: <MFileUploadOutlinedIcon />
				}
				onClick={async () => {
					openSelectDialog.open();
					let selectedPathList = await FileSystemUtility.select({
						filters: [{ name: 'PAM Computed JSON', extensions: ['pam.computed.json'] }],
						properties: ['openFile', 'showHiddenFiles'],
					});
					openSelectDialog.close();
					if (selectedPathList.length !== 0) {
						let path = selectedPathList[0].replaceAll('\\', '/');
						let beginTime = Date.now();
						messenger.backdrop.open();
						let data = await FileSystemUtility.readJSON(path);
						let duration = Date.now() - beginTime;
						if (duration < 100) {
							await setTimeout(100 - duration);
						}
						context.setStateImageDirectory(path.slice(0, path.lastIndexOf('/')));
						context.setDataSource(data as any);
						messenger.backdrop.close();
					}
				}}>
				{openSelectDialog.state
					? 'Waiting ...'
					: 'Animation File'
				}
			</MButton>
			<MTooltip title={disabledClearButton ? '' : 'clear'}>
				<MIconButton size='small' disabled={disabledClearButton} onClick={() => {
					context.setDataSource(null);
				}}>
					<MClearAllOutlinedIcon />
				</MIconButton>
			</MTooltip>
		</MStack>
	), [disabledClearButton, openSelectDialog.state]);
}

function ImageDirectoryController(props: {
}) {
	const context = useContext(StageContext);
	const tempValue = useValue('');
	const openSelectDialog = useOpenLogic(false);
	useMemo(() => {
		tempValue.setValue(context.state.imageDirectory);
	}, [context.state.imageDirectory]);
	return useMemo(() => (
		void console.log(`render ImageDirectoryController`) ||
		<MStack direction='row' alignItems='flex-end' spacing={1}>
			<MFolderSpecialOutlinedIcon sx={{ mb: 0.5 }} />
			<MTextField
				size='small'
				variant='standard'
				label='Image Directory'
				sx={{ width: 1 }}
				value={tempValue.value}
				onChange={(event) => {
					let value = event.target.value;
					tempValue.setValue(value);
				}}
				onBlur={() => {
					context.setStateImageDirectory(tempValue.value);
				}}
			/>
			<MTooltip title={openSelectDialog.state ? 'waiting ...' : 'select by dialog'}>
				<MBox>
					<MIconButton size='small'
						disabled={openSelectDialog.state}
						onClick={async () => {
							openSelectDialog.open();
							let selectedPathList = await FileSystemUtility.select({
								properties: ['openDirectory', 'showHiddenFiles'],
							});
							openSelectDialog.close();
							if (selectedPathList.length !== 0) {
								let path = selectedPathList[0].replaceAll('\\', '/');
								context.setStateImageDirectory(path);
							}
						}}>
						{openSelectDialog.state
							? <MCircularProgress color='inherit' size={24} />
							: <MDriveFolderUploadOutlinedIcon />
						}
					</MIconButton>
				</MBox>
			</MTooltip>
		</MStack>
	), [tempValue.value, openSelectDialog.state]);
}

function ImageListItem(props: {
	index: number;
	data: PvZ2AnimationComputedInformation.Image;
}) {
	const { index, data } = props;
	const context = useContext(StageContext);
	const path = `${context.state.imageDirectory.replaceAll('\\', '/')}/${data.source}.png`;
	const exist = useValue(false);
	useLayoutEffect(() => {
		(async () => {
			try {
				let stats = await FileSystemUtility.stat(path);
				exist.setValue(stats.isFile());
			} catch {
				exist.setValue(false);
			}
		})();
	}, [path]);
	return useMemo(() => (
		void console.log(`render ImageListItem ${index}`) ||
		<React.Fragment>
			<MListItem disablePadding
				secondaryAction={!exist.value &&
					<MIconButton edge='end'>
						<MErrorOutlineOutlinedIcon />
					</MIconButton>
				}
				sx={{
					mt: 0.5,
					'&>.MuiListItemSecondaryAction-root': {
						pointerEvents: 'none',
					},
				}}>
				<MTooltip placement='right' arrow sx={{ fontSize: 'large' }} title={
					<MStack direction='column' alignItems='center' spacing={2} sx={{ width: '256px', height: '256px' }}>
						<MBox sx={{ width: 1, height: 0, flexGrow: 1 }}>
							{!exist.value
								? <MBrokenImageOutlinedIcon sx={{ width: 1, height: 1 }} />
								: <img style={{
									width: '100%',
									height: '100%',
									content: `url('file://${path}')`,
									objectPosition: 'center',
									objectFit: 'contain',
								}} />
							}
						</MBox>
						<MTypography fontSize='small' color='text.secondary' align='center' sx={{ width: 1 }}>
							{!exist.value
								? `file is not found : file://${path}`
								: `${data.size[0]} x ${data.size[1]}`
							}
						</MTypography>
					</MStack>
				}>
					<MListItemButton>
						<MListItemText>
							<MStack direction='row' alignItems='center' spacing={1} sx={{ color: exist.value ? 'text.primary' : 'text.disabled' }}>
								<MTypography variant='caption' align='center' sx={{ width: '1.5em', flexShrink: 0 }}>
									{index + 1}
								</MTypography>
								<MTypography variant='body2' sx={{ flexGrow: 1, wordBreak: 'break-all' }}>
									{data.source}
								</MTypography>
							</MStack>
						</MListItemText>
					</MListItemButton>
				</MTooltip>
			</MListItem>
			<MDivider sx={{ mt: 0.5 }} />
		</React.Fragment>
	), [index, data, path, exist.value]);
}

function ImageListPanel(props: {
}) {
	const context = useContext(StageContext);
	return useMemo(() => (
		void console.log(`render ImageListPanel`) ||
		<MStack direction='column' spacing={0.5} sx={{ width: 1, height: 1 }}>
			<MStack direction='row' spacing={1} alignItems='center'>
				<MImageOutlinedIcon />
				<MTypography variant='subtitle1'>
					Image
				</MTypography>
			</MStack>
			<MStack direction='column' sx={{ height: 0, flexGrow: 1 }}>
				<MDivider flexItem />
				<MList disablePadding sx={{ overflow: 'hidden scroll' }}>
					{context.data?.source.image.map((e, i) => (
						<ImageListItem key={i} index={i} data={e} />
					))}
				</MList>
				<MDivider flexItem />
			</MStack>
		</MStack>
	), [context.data?.source]);
}

function SourcePanel(props: {
}) {
	return useMemo(() => (
		void console.log(`render SourcePanel`) ||
		<MStack direction='column' spacing={1} sx={{ width: 1, height: 1, p: 2 }}>
			<MStack direction='column' spacing={2} sx={{ width: 1, py: 2, mt: -1 }}>
				<SourceController />
				<ImageDirectoryController />
			</MStack>
			<MBox sx={{ width: 1, height: 0, flexGrow: 1 }}>
				<ImageListPanel />
			</MBox>
		</MStack>
	), []);
}

// ------------------------------------------------

export { SourcePanel };