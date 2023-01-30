import React, {
	useState,
	useRef,
	useMemo,
} from 'react';

// ------------------------------------------------

export function useValue<T>(
	initial: T,
) {
	const [value, setValue] = useState(initial);
	const ref = useRef<T>(undefined as any);
	useMemo(() => {
		ref.current = value;
	}, []);
	const getValueRef = useMemo(() => () => (ref.current), []);
	const setValueRef = useMemo(() => (newValue: T) => {
		ref.current = newValue;
		setValue(newValue);
	}, []);
	return {
		get value() { return getValueRef(); },
		setValue: setValueRef,
		ref: ref,
	};
}

export function useBoolean(
	initial: boolean,
) {
	const value = useValue(initial);
	const setTrue = useMemo(() => () => {
		value.setValue(true);
	}, []);
	const setFalse = useMemo(() => () => {
		value.setValue(false);
	}, []);
	const toggle = useMemo(() => () => {
		value.setValue(!value.value);
	}, []);
	return {
		get value() { return value.value; },
		setValue: value.setValue,
		ref: value.ref,
		setTrue,
		setFalse,
		toggle,
	};
}

export function useBooleanWithData<DataT>(
	initial: boolean,
	initialData: DataT,
) {
	const valueAndData = useValue({
		value: initial,
		data: initialData,
	});
	const setValue = useMemo(() => (value: boolean) => {
		valueAndData.setValue({
			...valueAndData.value,
			value: value,
		});
	}, []);
	const setTrue = useMemo(() => () => {
		valueAndData.setValue({
			...valueAndData.value,
			value: true,
		});
	}, []);
	const setFalse = useMemo(() => () => {
		valueAndData.setValue({
			...valueAndData.value,
			value: false,
		});
	}, []);
	const toggle = useMemo(() => () => {
		valueAndData.setValue({
			...valueAndData.value,
			value: !valueAndData.value.value,
		});
	}, []);
	const setData = useMemo(() => (data: DataT) => {
		valueAndData.setValue({
			...valueAndData.value,
			data: data,
		});
	}, []);
	const cleanData = useMemo(() => () => {
		valueAndData.setValue({
			...valueAndData.value,
			data: initialData,
		});
	}, []);
	const setTrueWithData = useMemo(() => (data: DataT) => {
		valueAndData.setValue({
			...valueAndData.value,
			value: true,
			data: data,
		});
	}, []);
	const setFalseWithData = useMemo(() => () => {
		valueAndData.setValue({
			...valueAndData.value,
			value: false,
			data: initialData,
		});
	}, []);
	return {
		get value() { return valueAndData.value.value; },
		get data() { return valueAndData.value.data; },
		setValue,
		setTrue,
		setFalse,
		toggle,
		setData,
		cleanData,
		setTrueWithData,
		setFalseWithData,
	};
}

export function useOpenLogic(
	initialState: boolean,
) {
	const state = useBoolean(initialState);
	return {
		get state() { return state.value; },
		setState: state.setValue,
		open: state.setTrue,
		close: state.setFalse,
		toggle: state.toggle,
	};
}

export function useOpenLogicWithData<DataT>(
	initialState: boolean,
	initialData: DataT,
) {
	const state = useBooleanWithData(initialState, initialData);
	return {
		get value() { return state.value; },
		get data() { return state.data; },
		setState: state.setValue,
		open: state.setTrue,
		close: state.setFalse,
		toggle: state.toggle,
		setData: state.setData,
		cleanData: state.cleanData,
		openWithData: state.setTrueWithData,
		closeWithData: state.setFalseWithData,
	};
}

export function useFormValue<DataT extends object>(
	initialData: DataT,
) {
	const data = useValue(initialData);
	const setItem = useMemo(() => (key: keyof DataT, value: any) => {
		data.setValue({
			...data.value,
			[key]: value,
		});
	}, []);
	const reset = useMemo(() => () => {
		data.setValue(initialData);
	}, []);
	return {
		get value() { return data.value; },
		setValue: data.setValue,
		ref: data.ref,
		setItem,
		reset,
	};
}
