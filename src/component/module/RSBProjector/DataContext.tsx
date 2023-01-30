import {
	createContext,
	useMemo,
} from 'react';

import {
	useFormValue,
	useValue,
} from '../../../common/utility/Hook';

// ------------------------------------------------

namespace Data {

	export type ResourceCategory = {
		resolution: null | number[];
		locale: null | string[];
	};

	export type Resource = {
		path: string;
		// category: ResourceCategory;
		// virtually: {
		// 	script: string;
		// 	option: Record<string, any>;
		// };

		//...
	};

	export type ResourceGroup = {
		resource: Array<Resource>;
	};

	export type Module = {
		group: Record<string, ResourceGroup>;
	};

	export type Project = {
		module: Record<string, Module>;
	};

	export type Solution = {
		project: Record<string, Project>;
	};

}

// ------------------------------------------------

type DataContextType = {
	solution: null | Data.Solution;
	setSolution: (value: DataContextType['solution']) => void;
};

const DataContext = createContext<DataContextType>(undefined as any);

// ------------------------------------------------

function useData(
): DataContextType {
	const data = useValue<DataContextType['solution']>(null);
	return {
		get solution() { return data.value; },
		setSolution: data.setValue,
	};
}

// ------------------------------------------------

export type { Data };
export { DataContext, useData };