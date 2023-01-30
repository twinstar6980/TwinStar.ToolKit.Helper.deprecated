

const electronRemote = window.require('@electron/remote');
const fs = window.require('fs/promises');

namespace FileSystemUtility {

	export async function select(
		options?: {
			title?: string;
			defaultPath?: string;
			buttonLabel?: string;
			filters?: {
				name: string;
				extensions: string[];
			}[];
			properties?: ('openFile' | 'openDirectory' | 'multiSelections' | 'showHiddenFiles' | 'createDirectory' | 'promptToCreate' | 'noResolveAliases' | 'treatPackageAsDirectory')[];
		},
	): Promise<string[]> {
		let result = await electronRemote.dialog.showOpenDialog(options);
		return result.filePaths;
	}

	export async function stat(
		path: string,
	): Promise<any> {
		return await fs.stat(path);
	}

	export async function readString(
		path: string,
	): Promise<string> {
		return await fs.readFile(path, 'utf8');
	}

	export async function readJSON(
		path: string,
	): Promise<any> {
		let data = await readString(path);
		return JSON.parse(data);
	}

	export async function writeString(
		path: string,
		data: string,
	): Promise<void> {
		await fs.writeFile(path, data);
		return;
	}

	export async function writeJSON(
		path: string,
		data: any,
	): Promise<void> {
		writeString(path, JSON.stringify(data));
		return;
	}

	// export async function list(
	// 	path: string,
	// ) {
	// 	let list: string[] = [];
	// 	let dir = this.fs.readdirSync(path);
	// 	console.log(dir);
	// 	return r;
	// }
}

export { FileSystemUtility };